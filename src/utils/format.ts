export type Language = 'fa' | 'en';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts ASCII digits 0-9 to Persian digits ۰-۹ when lang === 'fa'.
 */
export function toFaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/**
 * Formats numbers or strings with locale-appropriate digits.
 */
export function fmtNum(value: number | string, lang: Language = 'fa'): string {
  if (lang === 'en') {
    return String(value);
  }
  return toFaDigits(value);
}

/**
 * Formats percentage with locale-appropriate digits and percent symbol.
 */
export function fmtPercent(value: number, lang: Language = 'fa'): string {
  if (lang === 'en') {
    return `${value}%`;
  }
  return `${toFaDigits(value)}٪`;
}

/**
 * Bilingual text helper: returns `fa` string when language is Persian, otherwise `en`.
 */
export function bi(lang: Language, fa: string, en: string): string {
  return lang === 'fa' ? fa : en;
}
