/**
 * Animación de texto "construir / desconstruir".
 *
 * Desconstruye el texto anterior del último carácter al primero (borrado en
 * reversa) y construye el nuevo (escritura por frases). Cada frase recibe un
 * presupuesto de tiempo fijo, de modo que un texto largo no vuelve lenta la
 * animación.
 *
 * Garantías:
 * - Estado final = `textContent` plano (sin spans), manteniendo el requisito
 *   de "single rendered text".
 * - `prefers-reduced-motion` desactiva la animación (texto directo).
 * - Un token por elemento cancela la animación en curso si se dispara otra.
 */

export const FX_SELECTOR = "[data-textfx]";

/** Intervalo mínimo entre ticks de escritura (ms). */
const STEP_MS = 15;
/** Presupuesto de tiempo por segmento/frase (ms). */
const SEGMENT_BUDGET_MS = 500;
/** Máximo de caracteres revelados por tick (para no parecer un borrón). */
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
 * Divide el texto en segmentos (frases) para animar "por línea".
 * Separa en signos de puntuación seguidos de espacio (sin lookbehind,
 * compatible con navegadores más antiguos).
 */
export function splitSegments(text: string): string[] {
  if (!text) return [];
  const segments: string[] = [];
  const re = /[.!?;:]\s+/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    segments.push(text.slice(last, m.index + 1));
    last = m.index + m[0].length;
  }
  segments.push(text.slice(last));
  return segments.map((s) => s.trim()).filter(Boolean);
}

function construct(
  el: HTMLElement,
  text: string,
  token: number,
  reservedHeight?: number,
): void {
  const segments = splitSegments(text);
  if (segments.length === 0) {
    el.textContent = text;
    return;
  }

  const maxSteps = Math.max(2, Math.floor(SEGMENT_BUDGET_MS / STEP_MS));
  const plan: Array<{ start: number; perStep: number }> = [];
  let offset = 0;
  for (const seg of segments) {
    const len = seg.length;
    const perStep = Math.min(
      MAX_CHARS_PER_STEP,
      Math.max(1, Math.ceil(len / maxSteps)),
    );
    plan.push({ start: offset, perStep });
    offset += len;
  }

  // Reserva la altura final del texto mientras se escribe. Sin esto, al
  // vaciar el elemento su altura colapsa a 0 y el layout "parpadea".
  // Se mide sobre el texto completo (ya presente, o medido por `rebuildText`
  // antes de desconstruir) y se suelta al terminar.
  const height =
    reservedHeight ?? (text ? Math.ceil(el.getBoundingClientRect().height) : 0);
  if (height > 0) el.style.minHeight = `${height}px`;

  el.textContent = "";
  const textNode = document.createTextNode("");
  el.appendChild(textNode);

  let pos = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const finish = () => {
    if (!isCurrent(el, token)) return;
    if (timer !== undefined) clearTimeout(timer);
    el.textContent = text;
    el.style.minHeight = "";
  };

  const step = () => {
    if (!isCurrent(el, token)) return;
    if (pos >= text.length) {
      finish();
      return;
    }
    let perStep = MAX_CHARS_PER_STEP;
    for (let i = plan.length - 1; i >= 0; i--) {
      if (pos >= plan[i].start) {
        perStep = plan[i].perStep;
        break;
      }
    }
    pos = Math.min(text.length, pos + perStep);
    textNode.nodeValue = text.slice(0, pos);
    if (pos >= text.length) {
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

  // Mide la altura del texto completo ANTES de desconstruir (en este punto el
  // elemento ya contiene el texto nuevo escrito por los syncers): la reserva
  // evita que el layout salte mientras se desconstruye y reconstruye.
  const reservedHeight = Math.ceil(el.getBoundingClientRect().height);
  if (reservedHeight > 0) el.style.minHeight = `${reservedHeight}px`;

  destroy(el, oldText, token, () => {
    if (isCurrent(el, token)) construct(el, newText, token, reservedHeight);
  });
}
