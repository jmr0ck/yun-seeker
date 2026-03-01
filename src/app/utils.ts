export const validateDate = (s: string) => /^\d{4}\/\d{2}\/\d{2}$/.test(s.trim());
export const validateTime12h = (s: string) => /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(s.trim());
export const validatePlace = (s: string) => s.trim().includes(',');

export const parseHour24 = (s: string) => {
  const m = s.trim().toUpperCase().match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/);
  if (!m) return 12;
  let h = Number(m[1]);
  const mer = m[3];
  if (mer === 'AM') {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return h;
};

export const inferTimezone = (place: string) => {
  const p = place.toLowerCase();
  if (p.includes('hong kong')) return 'Asia/Hong_Kong';
  if (p.includes('new york') || p.includes('usa')) return 'America/New_York';
  if (p.includes('london') || p.includes('uk')) return 'Europe/London';
  if (p.includes('tokyo') || p.includes('japan')) return 'Asia/Tokyo';
  return 'Asia/Hong_Kong';
};

export const mapQuestionType = (q: string): 'love' | 'career' | 'finance' | 'lottery' | 'decision' => {
  const t = q.toLowerCase();
  if (t.includes('love')) return 'love';
  if (t.includes('career')) return 'career';
  if (t.includes('finance') || t.includes('money')) return 'finance';
  if (t.includes('lucky')) return 'lottery';
  return 'decision';
};
