// 12 supported languages. Arabic is RTL; everything else LTR.
export type Locale = "ar" | "en" | "es" | "pt-br" | "pt" | "fr" | "de" | "ru" | "zh" | "ja" | "ko" | "hi";

export const LOCALES: { code: Locale; nameNative: string; nameEn: string; dir: "rtl" | "ltr"; flag: string }[] = [
  { code: "ar",    nameNative: "العربية",     nameEn: "Arabic",                  dir: "rtl", flag: "🇸🇦" },
  { code: "en",    nameNative: "English",     nameEn: "English",                 dir: "ltr", flag: "🇬🇧" },
  { code: "es",    nameNative: "Español",     nameEn: "Spanish",                 dir: "ltr", flag: "🇪🇸" },
  { code: "pt-br", nameNative: "Português (BR)", nameEn: "Portuguese (Brazil)", dir: "ltr", flag: "🇧🇷" },
  { code: "pt",    nameNative: "Português",   nameEn: "Portuguese",              dir: "ltr", flag: "🇵🇹" },
  { code: "fr",    nameNative: "Français",    nameEn: "French",                  dir: "ltr", flag: "🇫🇷" },
  { code: "de",    nameNative: "Deutsch",     nameEn: "German",                  dir: "ltr", flag: "🇩🇪" },
  { code: "ru",    nameNative: "Русский",     nameEn: "Russian",                 dir: "ltr", flag: "🇷🇺" },
  { code: "zh",    nameNative: "中文",        nameEn: "Chinese",                 dir: "ltr", flag: "🇨🇳" },
  { code: "ja",    nameNative: "日本語",      nameEn: "Japanese",                dir: "ltr", flag: "🇯🇵" },
  { code: "ko",    nameNative: "한국어",       nameEn: "Korean",                  dir: "ltr", flag: "🇰🇷" },
  { code: "hi",    nameNative: "हिन्दी",       nameEn: "Hindi",                   dir: "ltr", flag: "🇮🇳" },
];

export const DEFAULT_LOCALE: Locale = "ar";
