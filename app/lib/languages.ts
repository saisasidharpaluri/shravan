export const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', sttLanguage: 'hi-IN', ttsLanguage: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', englishName: 'Hindi', htmlLang: 'hi', voice: 'Nalini' },
  { code: 'en-IN', sttLanguage: 'en-IN', ttsLanguage: 'en-IN', name: 'English (India)', nativeName: 'English', englishName: 'English (India)', htmlLang: 'en-IN', voice: 'Kaveri' },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.some(language => language.code === value);
}

export function getLanguage(code: Language) {
  return SUPPORTED_LANGUAGES.find(language => language.code === code) ?? SUPPORTED_LANGUAGES[0];
}
