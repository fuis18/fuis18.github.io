export const FX_SELECTOR = "[data-textfx]";

const STEP_MS = 15;
const LINE_BUDGET_MS = 450;
const MAX_CHARS_PER_STEP = 6;
const DESTROY_MS = 350;
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
    if (total <= 1) return null;

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
      bounds.push(best - 1);
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

  const height = reservedHeight ?? Math.ceil(el.getBoundingClientRect().height);
  if (height > 0) el.style.minHeight = `${height}px`;

  const maxSteps = Math.max(2, Math.floor(LINE_BUDGET_MS / STEP_MS));
  const perStepFor = (len: number) =>
    Math.min(MAX_CHARS_PER_STEP, Math.max(1, Math.ceil(len / maxSteps)));

  let timer: ReturnType<typeof setTimeout> | undefined;

  let anchor: ChildNode | undefined;

  const stillOwned = () => anchor === undefined || el.contains(anchor);

  const finish = () => {
    if (!isCurrent(el, token)) return;
    if (timer !== undefined) clearTimeout(timer);
    el.style.minHeight = "";
    if (stillOwned()) el.textContent = text;
  };

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
    const textNode = document.createTextNode("");
    el.appendChild(textNode);
    anchor = textNode;
    const perStep = perStepFor(lines[0].length);
    let pos = 0;
    const step = () => {
      if (!isCurrent(el, token)) return;
      if (!stillOwned()) return;
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
  anchor = jobs[0].node;

  const step = () => {
    if (!isCurrent(el, token)) return;
    if (!stillOwned()) return;
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

export function rebuildText(el: HTMLElement, oldText: string): void {
  const newText = el.textContent ?? "";

  if (prefersReducedMotion()) {
    el.textContent = newText;
    return;
  }

  if (animated.has(el) && oldText === newText) {
    return;
  }

  const token = nextToken(el);

  if (!animated.has(el)) {
    animated.add(el);
    if (newText) construct(el, newText, token);
    return;
  }

  const reservedHeight = Math.ceil(el.getBoundingClientRect().height);
  if (reservedHeight > 0) el.style.minHeight = `${reservedHeight}px`;
  const lineBounds = measureLineBreaks(el, newText);

  destroy(el, oldText, token, () => {
    if (isCurrent(el, token)) {
      construct(el, newText, token, reservedHeight, lineBounds);
    }
  });
}
