export type AppLanguage = 'en' | 'zh-HK';

export const LANGUAGE_STORAGE_KEY = 'yun:language:v1';

export const I18N = {
  en: {
    dashboard: 'Dashboard',
    questions: 'Questions',
    profile: 'Profile',
    language: 'Language',
    invalidEmail: 'Please enter a valid email for sign-in/sign-up.',
    invalidDate: 'Use format: YYYY/MM/DD',
    invalidTime: 'Use format: hh:mm AM/PM',
    invalidPlace: 'Use format: City, Country',
  },
  'zh-HK': {
    dashboard: '主頁',
    questions: '提問',
    profile: '檔案',
    language: '語言',
    invalidEmail: '請輸入有效電郵以登入或註冊。',
    invalidDate: '請使用格式：YYYY/MM/DD',
    invalidTime: '請使用格式：hh:mm AM/PM',
    invalidPlace: '請使用格式：城市, 國家',
  },
} as const;
