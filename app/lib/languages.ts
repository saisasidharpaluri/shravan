export const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', sttLanguage: 'hi-IN', ttsLanguage: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', htmlLang: 'hi', voice: 'Deepak', glyph: 'अ', example: 'उदाहरण: पार्क के पास सड़क पर बड़ा गड्ढा है…', confirmation: 'आपकी डेमो रिपोर्ट इस डिवाइस पर सेव हो गई है।' },
  { code: 'en-IN', sttLanguage: 'en-IN', ttsLanguage: 'en-IN', name: 'English (India)', nativeName: 'English', htmlLang: 'en-IN', voice: 'Yashvi', glyph: 'A', example: 'Example: There is a large pothole near the park…', confirmation: 'Your demo report is saved on this device.' },
  { code: 'bn-IN', sttLanguage: 'bn-IN', ttsLanguage: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', htmlLang: 'bn', voice: 'Kirra', glyph: 'অ', example: 'উদাহরণ: পার্কের কাছে রাস্তায় একটি বড় গর্ত আছে…', confirmation: 'আপনার ডেমো রিপোর্টটি এই ডিভাইসে সংরক্ষিত হয়েছে।' },
  { code: 'ta-IN', sttLanguage: 'ta-IN', ttsLanguage: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', htmlLang: 'ta', voice: 'Brinda', glyph: 'அ', example: 'எடுத்துக்காட்டு: பூங்கா அருகே சாலையில் பெரிய பள்ளம் உள்ளது…', confirmation: 'உங்கள் டெமோ அறிக்கை இந்தச் சாதனத்தில் சேமிக்கப்பட்டுள்ளது.' },
  { code: 'te-IN', sttLanguage: 'te-IN', ttsLanguage: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', htmlLang: 'te', voice: 'Yukti', glyph: 'అ', example: 'ఉదాహరణ: పార్కు దగ్గర రోడ్డుపై పెద్ద గుంత ఉంది…', confirmation: 'మీ డెమో నివేదిక ఈ పరికరంలో సేవ్ చేయబడింది.' },
  { code: 'mr-IN', sttLanguage: 'mr-IN', ttsLanguage: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', htmlLang: 'mr', voice: 'Omkar', glyph: 'म', example: 'उदाहरण: उद्यानाजवळच्या रस्त्यावर मोठा खड्डा आहे…', confirmation: 'तुमचा डेमो अहवाल या डिव्हाइसवर जतन केला आहे.' },
  { code: 'gu-IN', sttLanguage: 'gu-IN', ttsLanguage: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', htmlLang: 'gu', voice: 'Vikrant', glyph: 'અ', example: 'ઉદાહરણ: પાર્ક પાસેના રસ્તા પર મોટો ખાડો છે…', confirmation: 'તમારો ડેમો અહેવાલ આ ઉપકરણમાં સાચવવામાં આવ્યો છે.' },
  { code: 'kn-IN', sttLanguage: 'kn-IN', ttsLanguage: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', htmlLang: 'kn', voice: 'Kavin', glyph: 'ಅ', example: 'ಉದಾಹರಣೆ: ಉದ್ಯಾನದ ಹತ್ತಿರದ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿಯಿದೆ…', confirmation: 'ನಿಮ್ಮ ಡೆಮೊ ವರದಿ ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.' },
  { code: 'ml-IN', sttLanguage: 'ml-IN', ttsLanguage: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', htmlLang: 'ml', voice: 'Reshma', glyph: 'അ', example: 'ഉദാഹരണം: പാർക്കിന് സമീപമുള്ള റോഡിൽ വലിയ കുഴിയുണ്ട്…', confirmation: 'നിങ്ങളുടെ ഡെമോ റിപ്പോർട്ട് ഈ ഉപകരണത്തിൽ സംരക്ഷിച്ചു.' },
  { code: 'pa-IN', sttLanguage: 'pa-IN', ttsLanguage: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', htmlLang: 'pa', voice: 'Zayan', glyph: 'ਅ', example: 'ਉਦਾਹਰਨ: ਪਾਰਕ ਦੇ ਨੇੜੇ ਸੜਕ ’ਤੇ ਵੱਡਾ ਟੋਆ ਹੈ…', confirmation: 'ਤੁਹਾਡੀ ਡੈਮੋ ਰਿਪੋਰਟ ਇਸ ਡਿਵਾਈਸ ’ਤੇ ਸੁਰੱਖਿਅਤ ਕੀਤੀ ਗਈ ਹੈ।' },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.some(language => language.code === value);
}

export function getLanguage(code: Language) {
  return SUPPORTED_LANGUAGES.find(language => language.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function getLanguageOrDefault(value: unknown): Language {
  return isSupportedLanguage(value) ? value : SUPPORTED_LANGUAGES[0].code;
}
