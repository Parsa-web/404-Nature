/** Normalizes Persian/Arabic text so that search matches regardless of keyboard. */
export function normalizeFa(input: string): string {
  return input
    .replace(/[\u064B-\u065F\u0640\u200c\u200f\u200e]/g, '')
    .replace(/[\u0623\u0625\u0622]/g, '\u0627')
    .replace(/\u0649/g, '\u06cc')
    .replace(/\u064a/g, '\u06cc')
    .replace(/\u0643/g, '\u06a9')
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
/** Renders latin digits as Persian digits for display. */
export function faNum(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)])
}
