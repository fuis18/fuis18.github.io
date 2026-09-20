/**
 * Animación de texto "construir / desconstruir".
 *
 * Desconstruye el texto anterior del último carácter al primero (borrado en
 * reversa) y construye el nuevo con líneas simultáneas: el texto se parte en
 * sus líneas visuales reales y todas se escriben a la vez (avanzan en cada
 * tick), de modo que un texto de N líneas se llena como un bloque único con
 * un presupuesto fijo, sin importar su longitud.
 *
 * Garantías:
 * - Estado final = `textContent` plano (sin spans), manteniendo el requisito
 *   de "single rendered text".
 * - `prefers-reduced-motion` desactiva la animación (texto directo).
 * - Un token por elemento cancela la animación en curso si se dispara otra.
 * - Sin medición de líneas (oculto/jsdom) cae a un tipeo de una sola pasada.
 */

export const FX_SELECTOR = "[data-textfx]";

/** Intervalo mínimo entre ticks de escritura (ms). */
const STEP_MS = 15;
/** Presupuesto de tiempo total de la construcción (ms), compartido por todas las líneas. */
const LINE_BUDGET_MS = 450;
/** Máximo de caracteres revelados por tick y por línea (para no parecer un borrón). */
const MAX_CHARS_PER_STEP = 6;
/** Duración total de la desconstrucción (ms). */
const DESTROY_MS = 350;
/** Transición de disolución por carácter (ms). */
const CHAR_FADE_MS = 120;

const tokens = new WeakMap<HTMLElement, number>();
const animated = new WeakSet<HTMLElement>();

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function nextToken(el: HTMLElement): number {
  const t = (tokens.get(el) ?? 0) + 1;
  tokens.set(el, t);
  return t;
}

function isCurrent(el: HTMLElement, token: number): boolean {
  return tokens.get(el) === token;
}

/**
 * Mide en qué offsets termina cada línea visual del texto (fines exclusivos,
 * sin incluir la última línea). Requiere que el elemento contenga el texto
 * completo en un nodo de texto. Devuelve `null` si no se puede medir
 * (elemento oculto, sin layout, jsdom o texto de una sola línea).
 */
export function measureLineBreaks(
  el: HTMLElement,
  text: string,
): number[] | null {
  const node = [...el.childNodes].find(
    (n): n is Text => n.nodeType === Node.TEXT_NODE && n.textContent === text,
  );
  if (!node) return null;

  try {
    const range = document.createRange();
    range.selectNodeContents(node);
    const total = range.getClientRects().length;
    if (total <= 1) return null; // oculto, sin layout o una sola línea

    const bounds: number[] = [];
    let lineStart = 0;
    for (let target = 2; target <= total; target++) {
      let lo = lineStart + 1;
      let hi = text.length;
      let best = -1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        range.setEnd(node, mid);
        if (range.getClientRects().length >= target) {
          best = mid;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      if (best < 0) return null;
      bounds.push(best - 1); // fin exclusivo de la línea anterior
      lineStart = best;
    }
    return bounds;
  } catch {
    return null;
  }
}

function construct(
  el: HTMLElement,
  text: string,
  token: number,
  reservedHeight?: number,
  lineBounds?: number[] | null,
): void {
  if (!text) {
    el.textContent = text;
    return;
  }

  const bounds =
    lineBounds !== undefined ? lineBounds : measureLineBreaks(el, text);

  // Reserva la altura final del texto mientras se escribe. Sin esto, al
  // vaciar el elemento su altura colapsa a 0 y el layout "parpadea".
  // Se mide sobre el texto completo (ya presente, o medido por `rebuildText`
  // antes de desconstruir) y se suelta al terminar.
  const height = reservedHeight ?? Math.ceil(el.getBoundingClientRect().height);
  if (height > 0) el.style.minHeight = `${height}px`;

  const maxSteps = Math.max(2, Math.floor(LINE_BUDGET_MS / STEP_MS));
  const perStepFor = (len: number) =>
    Math.min(MAX_CHARS_PER_STEP, Math.max(1, Math.ceil(len / maxSteps)));

  let timer: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (!isCurrent(el, token)) return;
    if (timer !== undefined) clearTimeout(timer);
    el.textContent = text;
    el.style.minHeight = "";
  };

  // Parte el texto por sus líneas visuales medidas (fallback: una sola línea).
  const lines: string[] = [];
  if (bounds !== null) {
    let prev = 0;
    for (const end of bounds) {
      const line = text.slice(prev, end);
      if (line.length > 0) lines.push(line);
      prev = end;
    }
    lines.push(text.slice(prev));
  } else {
    lines.push(text);
  }

  el.textContent = "";

  if (lines.length <= 1) {
    // Una sola línea (o sin medición): un nodo de texto, sin spans.
    const textNode = document.createTextNode("");
    el.appendChild(textNode);
    const perStep = perStepFor(lines[0].length);
    let pos = 0;
    const step = () => {
      if (!isCurrent(el, token)) return;
      pos = Math.min(text.length, pos + perStep);
      textNode.nodeValue = text.slice(0, pos);
      if (pos >= text.length) {
        finish();
        return;
      }
      timer = setTimeout(step, STEP_MS);
    };
    timer = setTimeout(step, STEP_MS);
    return;
  }

  // Varias líneas: un span block por línea; todas avanzan en cada tick.
  const frag = document.createDocumentFragment();
  const jobs = lines.map((line) => {
    const span = document.createElement("span");
    span.className = "textfx-line";
    span.style.display = "block";
    const node = document.createTextNode("");
    span.appendChild(node);
    frag.appendChild(span);
    return { text: line, node, pos: 0, perStep: perStepFor(line.length) };
  });
  el.appendChild(frag);

  const step = () => {
    if (!isCurrent(el, token)) return;
    let pending = false;
    for (const job of jobs) {
      if (job.pos >= job.text.length) continue;
      job.pos = Math.min(job.text.length, job.pos + job.perStep);
      job.node.nodeValue = job.text.slice(0, job.pos);
      pending = true;
    }
    if (!pending) {
      finish();
      return;
    }
    timer = setTimeout(step, STEP_MS);
  };
  timer = setTimeout(step, STEP_MS);
}

function destroy(
  el: HTMLElement,
  oldText: string,
  token: number,
  onDone: () => void,
): void {
  const chars = [...oldText];
  if (chars.length === 0) {
    onDone();
    return;
  }

  el.innerHTML = "";
  el.classList.add("textfx-destroying");

  const n = chars.length;
  const stagger = n > 1 ? (DESTROY_MS * 0.7) / (n - 1) : 0;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const span = document.createElement("span");
    span.className = "textfx-char";
    span.textContent = chars[i];
    // El último carácter se desvanece primero: desconstrucción del final al
    // inicio (retardo = (n - 1 - i) * stagger).
    const delay = Math.round((n - 1 - i) * stagger);
    span.style.transition = `opacity ${CHAR_FADE_MS}ms ease ${delay}ms, transform 200ms ease ${delay}ms`;
    frag.appendChild(span);
  }
  el.appendChild(frag);

  const dissolve = () => {
    if (!isCurrent(el, token)) return;
    el.querySelectorAll<HTMLElement>(".textfx-char").forEach((span) => {
      span.style.opacity = "0";
      span.style.transform = "translateY(-0.35em)";
    });
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(dissolve);
  } else {
    setTimeout(dissolve, 16);
  }

  setTimeout(() => {
    if (!isCurrent(el, token)) return;
    el.classList.remove("textfx-destroying");
    onDone();
  }, DESTROY_MS + CHAR_FADE_MS);
}

/**
 * Construye (escribe) el texto actual del elemento. Para entradas de página
 * (primera carga / navegación).
 */
export function buildText(el: HTMLElement): void {
  const text = el.textContent ?? "";
  const token = nextToken(el);
  animated.add(el);
  if (!text || prefersReducedMotion()) {
    el.textContent = text;
    return;
  }
  construct(el, text, token);
}

/**
 * Desconstruye `oldText` y construye el texto actual del elemento
 * (ya actualizado por los syncers). Para cambios de idioma.
 */
export function rebuildText(el: HTMLElement, oldText: string): void {
  const newText = el.textContent ?? "";

  if (prefersReducedMotion()) {
    el.textContent = newText;
    return;
  }

  // Elemento ya animado con texto sin cambios reales: no hacer nada.
  // Crítico: no invalidar el token de una construcción de entrada en curso
  // (un `lang-change` redundante al cargar la página la dejaría a medias).
  if (animated.has(el) && oldText === newText) {
    return;
  }

  const token = nextToken(el);

  if (!animated.has(el)) {
    // Elemento fresco (navegación/carga): solo construcción de entrada.
    animated.add(el);
    if (newText) construct(el, newText, token);
    return;
  }

  // Mide la altura y las líneas visuales del texto completo ANTES de
  // desconstruir (en este punto el elemento ya contiene el texto nuevo escrito
  // por los syncers): la reserva evita que el layout salte y los límites de
  // línea permiten construir con líneas simultáneas tras la desconstrucción.
  const reservedHeight = Math.ceil(el.getBoundingClientRect().height);
  if (reservedHeight > 0) el.style.minHeight = `${reservedHeight}px`;
  const lineBounds = measureLineBreaks(el, newText);

  destroy(el, oldText, token, () => {
    if (isCurrent(el, token)) {
      construct(el, newText, token, reservedHeight, lineBounds);
    }
  });
}
