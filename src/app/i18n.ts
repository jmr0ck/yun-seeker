export type AppLanguage = 'en' | 'zh-HK' | 'zh-CN' | 'ja' | 'ko' | 'es';

export const LANGUAGE_STORAGE_KEY = 'yun:language:v1';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['en', 'zh-HK', 'zh-CN', 'ja', 'ko', 'es'];

export type Dict = {
  dashboard: string;
  questions: string;
  profile: string;
  language: string;
  invalidEmail: string;
  invalidDate: string;
  invalidTime: string;
  invalidPlace: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  getStarted: string;
  authTitle: string;
  authSubtitle: string;
  continue: string;
  walletTitle: string;
  walletSubtitle: string;
  connectSeeker: string;
  walletFallback: string;
  profileSetup: string;
  birthDateLabel: string;
  birthTimeLabel: string;
  birthPlaceLabel: string;
  currentLocationLabel: string;
  reviewProfile: string;
  confirmProfile: string;
  parsedProfile: string;
  date: string;
  time: string;
  birthPlace: string;
  currentLocation: string;
  timezone: string;
  confirmSave: string;
  edit: string;
  dashboardTitle: string;
  storedProfile: string;
  askQuestion: string;
  editProfile: string;
  recentReports: string;
  noReports: string;
  qPrefix: string;
  questionsTitle: string;
  customQuestion: string;
  customQuestionPlaceholder: string;
  generateReport: string;
  yourReport: string;
  noSummary: string;
  focus: string;
  confidence: string;
  keyHighlights: string;
  detailedOutput: string;
  actionPlan: string;
  riskWatch: string;
  timingWindows: string;
  shareExport: string;
  askAnother: string;
  backDashboard: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  evidence: string;
  howDerived: string;
  citations: string;
};

const EN: Dict = {
  dashboard: 'Dashboard', questions: 'Questions', profile: 'Profile', language: 'Language',
  invalidEmail: 'Please enter a valid email for sign-in/sign-up.', invalidDate: 'Use format: YYYY/MM/DD', invalidTime: 'Use format: hh:mm AM/PM', invalidPlace: 'Use format: City, Country',
  welcomeTitle: 'Welcome to yun-seeker', welcomeSubtitle: 'Your destiny dashboard, powered by profile + Solana identity.', getStarted: 'Get Started',
  authTitle: 'Sign In / Sign Up', authSubtitle: 'MVP auth gate (email) before wallet and profile setup.', continue: 'Continue',
  walletTitle: 'Connect SOL Wallet', walletSubtitle: 'Primary path: Seeker built-in wallet.', connectSeeker: 'Connect Seeker Wallet', walletFallback: 'Other Wallets (Fallback)',
  profileSetup: 'Profile Setup', birthDateLabel: 'Birth Date (yyyy/mm/dd)', birthTimeLabel: 'Birth Time (hh:mm AM/PM)', birthPlaceLabel: 'Birth Place (City, Country)', currentLocationLabel: 'Current Living Location (optional)', reviewProfile: 'Review Profile',
  confirmProfile: 'Confirm Profile', parsedProfile: 'Parsed Profile', date: 'Date', time: 'Time', birthPlace: 'Birth place', currentLocation: 'Current location', timezone: 'Timezone', confirmSave: 'Confirm & Save', edit: 'Edit',
  dashboardTitle: 'User Dashboard', storedProfile: 'Stored Profile', askQuestion: 'Ask a Question', editProfile: 'Edit Profile', recentReports: 'Recent Reports', noReports: 'No reports yet.', qPrefix: 'Q',
  questionsTitle: 'Ask a Question', customQuestion: 'Custom question', customQuestionPlaceholder: 'e.g. Where will I meet my true love in March?', generateReport: 'Generate Report',
  yourReport: 'Your Report', noSummary: 'No summary.', focus: 'Focus', confidence: 'Confidence', keyHighlights: 'Key Highlights', detailedOutput: 'Detailed Output', actionPlan: 'Action Plan', riskWatch: 'Risk Watch', timingWindows: 'Timing Windows', shareExport: 'Share / Export Report', askAnother: 'Ask Another Question', backDashboard: 'Back to Dashboard', confidenceHigh: 'High', confidenceMedium: 'Medium', confidenceLow: 'Low', evidence: 'Evidence', howDerived: 'How this was derived', citations: 'Citations',
};

export const RTL_LANGUAGES: AppLanguage[] = [];

export const I18N: Record<AppLanguage, Dict> = {
  en: EN,
  'zh-HK': {
    ...EN,
    dashboard: '主頁', questions: '提問', profile: '檔案', language: '語言',
    invalidEmail: '請輸入有效電郵以登入或註冊。', invalidDate: '請使用格式：YYYY/MM/DD', invalidTime: '請使用格式：hh:mm AM/PM', invalidPlace: '請使用格式：城市, 國家',
    welcomeTitle: '歡迎使用 yun-seeker', getStarted: '開始使用', authTitle: '登入 / 註冊', continue: '繼續',
    walletTitle: '連接 SOL 錢包', connectSeeker: '連接 Seeker 錢包', walletFallback: '其他錢包（備用）',
    profileSetup: '建立檔案', reviewProfile: '檢查檔案', confirmProfile: '確認檔案', parsedProfile: '已解析檔案',
    date: '日期', time: '時間', birthPlace: '出生地', currentLocation: '現居地',
    confirmSave: '確認並儲存', edit: '編輯', dashboardTitle: '用戶主頁', storedProfile: '已儲存檔案', askQuestion: '開始提問', editProfile: '編輯檔案', recentReports: '最近報告', noReports: '暫無報告。',
    questionsTitle: '提出問題', customQuestion: '自訂問題', generateReport: '生成報告', yourReport: '你的報告',
    keyHighlights: '重點摘要', detailedOutput: '詳細輸出', actionPlan: '行動計劃', riskWatch: '風險提示', timingWindows: '時機視窗', shareExport: '分享 / 匯出報告', askAnother: '再問一題', backDashboard: '返回主頁', confidenceHigh: '高', confidenceMedium: '中', confidenceLow: '低', evidence: '證據', howDerived: '推導方式', citations: '引用',
  },
  'zh-CN': {
    ...EN,
    dashboard: '主页', questions: '提问', profile: '档案', language: '语言',
    invalidEmail: '请输入有效邮箱以登录或注册。', invalidDate: '请使用格式：YYYY/MM/DD', invalidTime: '请使用格式：hh:mm AM/PM', invalidPlace: '请使用格式：城市, 国家',
    welcomeTitle: '欢迎使用 yun-seeker', getStarted: '开始使用', authTitle: '登录 / 注册', continue: '继续',
    walletTitle: '连接 SOL 钱包', connectSeeker: '连接 Seeker 钱包', walletFallback: '其他钱包（备用）',
    profileSetup: '建立档案', reviewProfile: '检查档案', confirmProfile: '确认档案', parsedProfile: '已解析档案',
    date: '日期', time: '时间', birthPlace: '出生地', currentLocation: '现居地',
    confirmSave: '确认并保存', edit: '编辑', dashboardTitle: '用户主页', storedProfile: '已保存档案', askQuestion: '开始提问', editProfile: '编辑档案', recentReports: '最近报告', noReports: '暂无报告。',
    questionsTitle: '提出问题', customQuestion: '自定义问题', generateReport: '生成报告', yourReport: '你的报告',
    keyHighlights: '重点摘要', detailedOutput: '详细输出', actionPlan: '行动计划', riskWatch: '风险提示', timingWindows: '时机窗口', shareExport: '分享 / 导出报告', askAnother: '再问一题', backDashboard: '返回主页', confidenceHigh: '高', confidenceMedium: '中', confidenceLow: '低', evidence: '证据', howDerived: '推导方式', citations: '引用',
  },
  ja: { ...EN, dashboard: 'ダッシュボード', questions: '質問', profile: 'プロフィール', language: '言語', welcomeTitle: 'yun-seeker へようこそ', getStarted: '開始', authTitle: 'サインイン / サインアップ', continue: '続行', walletTitle: 'SOLウォレット接続', connectSeeker: 'Seekerウォレットを接続', profileSetup: 'プロフィール設定', questionsTitle: '質問する', yourReport: 'レポート', backDashboard: 'ダッシュボードへ戻る', confidenceHigh: '高', confidenceMedium: '中', confidenceLow: '低' },
  ko: { ...EN, dashboard: '대시보드', questions: '질문', profile: '프로필', language: '언어', welcomeTitle: 'yun-seeker에 오신 것을 환영합니다', getStarted: '시작하기', authTitle: '로그인 / 회원가입', continue: '계속', walletTitle: 'SOL 지갑 연결', connectSeeker: 'Seeker 지갑 연결', profileSetup: '프로필 설정', questionsTitle: '질문하기', yourReport: '리포트', backDashboard: '대시보드로 돌아가기', confidenceHigh: '높음', confidenceMedium: '보통', confidenceLow: '낮음' },
  es: { ...EN, dashboard: 'Panel', questions: 'Preguntas', profile: 'Perfil', language: 'Idioma', welcomeTitle: 'Bienvenido a yun-seeker', getStarted: 'Comenzar', authTitle: 'Iniciar sesión / Registrarse', continue: 'Continuar', walletTitle: 'Conectar billetera SOL', connectSeeker: 'Conectar billetera Seeker', profileSetup: 'Configurar perfil', questionsTitle: 'Hacer una pregunta', yourReport: 'Tu reporte', backDashboard: 'Volver al panel', confidenceHigh: 'Alta', confidenceMedium: 'Media', confidenceLow: 'Baja' },
};
