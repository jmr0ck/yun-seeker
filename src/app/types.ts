export type Screen =
  | 'welcome'
  | 'auth'
  | 'wallet'
  | 'profile'
  | 'profileConfirm'
  | 'dashboard'
  | 'questions'
  | 'reading';

export type Profile = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  currentLocation?: string;
  timezone: string;
};

export type ReadingResult = {
  title: string;
  summary: string;
  data: any;
  askedAt: string;
  question: string;
  highlights: string[];
  confidence: 'Low' | 'Medium' | 'High';
  focus: string;
};
