export type AppLanguage = 'en' | 'zh-HK' | 'zh-CN' | 'ja' | 'ko' | 'es';

export const LANGUAGE_STORAGE_KEY = 'yun:language:v1';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'zh-HK', 'zh-CN', 'ja', 'ko', 'es'];

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
  'zh-CN': {
    dashboard: '主页',
    questions: '提问',
    profile: '档案',
    language: '语言',
    invalidEmail: '请输入有效邮箱以登录或注册。',
    invalidDate: '请使用格式：YYYY/MM/DD',
    invalidTime: '请使用格式：hh:mm AM/PM',
    invalidPlace: '请使用格式：城市, 国家',
  },
  ja: {
    dashboard: 'ダッシュボード',
    questions: '質問',
    profile: 'プロフィール',
    language: '言語',
    invalidEmail: '有効なメールアドレスを入力してください。',
    invalidDate: '形式: YYYY/MM/DD',
    invalidTime: '形式: hh:mm AM/PM',
    invalidPlace: '形式: 市, 国',
  },
  ko: {
    dashboard: '대시보드',
    questions: '질문',
    profile: '프로필',
    language: '언어',
    invalidEmail: '유효한 이메일을 입력해 주세요.',
    invalidDate: '형식: YYYY/MM/DD',
    invalidTime: '형식: hh:mm AM/PM',
    invalidPlace: '형식: 도시, 국가',
  },
  es: {
    dashboard: 'Panel',
    questions: 'Preguntas',
    profile: 'Perfil',
    language: 'Idioma',
    invalidEmail: 'Introduce un correo electrónico válido.',
    invalidDate: 'Formato: YYYY/MM/DD',
    invalidTime: 'Formato: hh:mm AM/PM',
    invalidPlace: 'Formato: Ciudad, País',
  },
} as const;
