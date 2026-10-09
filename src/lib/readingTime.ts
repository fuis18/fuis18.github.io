export const WORDS_PER_MINUTE = 200;
export const CJK_CHARS_PER_MINUTE = 400;

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

export function estimateReadingTime(body: string | undefined): number {
  const text = (body ?? "").trim();
  if (!text) return 1;

  const cjkChars = text.match(CJK)?.length ?? 0;

  const words = text
    .replace(CJK, " ")
    .split(/\s+/)
    .filter((token) => LETTER_OR_DIGIT.test(token)).length;

  return Math.max(
    1,
    Math.round(cjkChars / CJK_CHARS_PER_MINUTE + words / WORDS_PER_MINUTE),
  );
}
