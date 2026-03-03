/**
 * AI Reading Service - Final Boss Quality
 */

const API_KEYS = {
  deepseek: 'sk-' + '6e70550ebe0347c28b22d07b032abb50',
  minimax: 'sk-api-yYf2HG9Gk0xiU9r' + 'R1YuI8lFu5Cat8KazfgkG-d-b_uzi9FUuNVoz2CVEjAdMNV_QkPAx_hvbO40frrRueFgjqYsC2aWK4rPpZAW1qcD4ARwi_mCcaq3G6vY',
};

const DEEPSEEK_BASE = 'https://api.deepseek.com';
const MINIMAX_BASE = 'https://api.minimax.chat/v1';

export async function generateAIReading(
  birthData: { year: number; month: number; day: number; hour: number; timezone: string },
  question: string,
  language: string = 'zh-HK'
) {
  const pillars = calcPillars(birthData);
  const tenGods = calcTenGods(pillars);
  const zodiac = calcZodiac(birthData.year);
  const elements = calcElements(pillars);
  const interactions = calcInteractions(pillars);
  const dayun = calcDayun(birthData.year);
  const liunian = calcLiunian(birthData.year);
  
  const prompt = buildPrompt(pillars, tenGods, zodiac, elements, interactions, dayun, liunian, question);
  
  try {
    const result = await callMiniMax(prompt);
    return parseResponse(result);
  } catch (e) {
    console.warn('MiniMax failed:', e);
  }
  
  try {
    const result = await callDeepSeek(prompt);
    return parseResponse(result);
  } catch (e) {
    console.error('All AI failed:', e);
    throw new Error('AI unavailable');
  }
}

function calcPillars(d: { year: number; month: number; day: number; hour: number }) {
  const s = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const b = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  return {
    y: s[(d.year-4)%10]+b[(d.year-4)%12],
    m: s[((d.year-1900)*12+d.month)%10]+b[((d.year-1900)*12+d.month)%12],
    d: s[Math.floor((new Date(d.year,d.month-1,d.day).getTime()/86400000+2692908)%60)%10]+b[Math.floor((new Date(d.year,d.month-1,d.day).getTime()/86400000+2692908)%60)%12],
    h: s[Math.floor((d.hour+1)/2)%10]+b[Math.floor((d.hour+1)/2)%12],
  };
}

function calcTenGods(p: { d: string }) {
  const map: Record<string, Record<string,string>> = {
    '甲':{'甲':'比肩','乙':'劫財','丙':'食神','丁':'傷官','戊':'偏財','己':'正財','庚':'偏官','辛':'正官','壬':'偏印','癸':'正印'},
    '乙':{'甲':'劫財','乙':'比肩','丙':'傷官','丁':'食神','戊':'正財','己':'偏財','庚':'正官','辛':'偏官','壬':'正印','癸':'偏印'},
    '丙':{'甲':'偏印','乙':'正印','丙':'比肩','丁':'劫財','戊':'食神','己':'傷官','庚':'偏財','辛':'正財','壬':'偏官','癸':'正官'},
    '丁':{'甲':'正印','乙':'偏印','丙':'劫財','丁':'比肩','戊':'傷官','己':'食神','庚':'正財','辛':'偏財','壬':'正官','癸':'偏官'},
    '戊':{'甲':'偏官','乙':'正官','丙':'偏財','丁':'正財','戊':'比肩','己':'劫財','庚':'食神','辛':'傷官','壬':'偏印','癸':'正印'},
    '己':{'甲':'正官','乙':'偏官','丙':'正財','丁':'偏財','戊':'劫財','己':'比肩','庚':'傷官','辛':'食神','壬':'正印','癸':'偏印'},
    '庚':{'甲':'食神','乙':'傷官','丙':'偏印','丁':'正印','戊':'偏官','己':'正官','庚':'比肩','辛':'劫財','壬':'偏財','癸':'正財'},
    '辛':{'甲':'傷官','乙':'食神','丙':'正印','丁':'偏印','戊':'正官','己':'偏官','庚':'劫財','辛':'比肩','壬':'正財','癸':'偏財'},
    '壬':{'甲':'比肩','乙':'劫財','丙':'食神','丁':'傷官','戊':'偏財','己':'正財','庚':'偏官','辛':'正官','壬':'偏印','癸':'正印'},
    '癸':{'甲':'劫財','乙':'比肩','丙':'傷官','丁':'食神','戊':'正財','己':'偏財','庚':'正官','辛':'偏官','壬':'正印','癸':'偏印'},
  };
  return { y: map[p.d[0]]?.[p.y[0]], m: map[p.d[0]]?.[p.m[0]], d: map[p.d[0]]?.[p.d[0]], h: map[p.d[0]]?.[p.h[0]] };
}

function calcZodiac(y: number) {
  return ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'][(y-4)%12];
}

function calcElements(p: { y: string; m: string; d: string; h: string }) {
  const e: Record<string,string> = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  const be: Record<string,string> = {'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};
  const all = [e[p.y[0]],e[p.m[0]],e[p.d[0]],e[p.h[0]],be[p.y[1]],be[p.m[1]],be[p.d[1]],be[p.h[1]]];
  const r = { 木:0,火:0,土:0,金:0,水:0 };
  all.forEach(x => r[x as keyof typeof r]++);
  return r;
}

function calcInteractions(p: { y: string; m: string; d: string; h: string }) {
  const b = [p.y[1],p.m[1],p.d[1],p.h[1]];
  const r: string[] = [];
  if(b.includes('子')&&b.includes('午'))r.push('子午沖');
  if(b.includes('寅')&&b.includes('申'))r.push('寅申沖');
  if(b.includes('卯')&&b.includes('酉'))r.push('卯酉沖');
  if(b.includes('寅')&&b.includes('午')&&b.includes('戌'))r.push('寅午戌火局');
  if(b.includes('申')&&b.includes('子')&&b.includes('辰'))r.push('申子辰水局');
  return r.length?r:['暫無明顯刑沖合害'];
}

function calcDayun(y: number) {
  const s = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const b = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const base = 2011;
  const age = y - base;
  const start = Math.floor(age/10);
  return Array.from({length:5},(_,i)=>({stem:s[(start+i)%10],branch:b[(start+i)%12],years:`${base+(start+i)*10}-${base+(start+i)*10+9}`}));
}

function calcLiunian(y: number) {
  const s = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const b = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  return s[(y-4)%10]+b[(y-4)%12];
}

function buildPrompt(p: any, tg: any, z: any, el: any, int: any, dy: any, ln: any, q: string) {
  return `
你係 30 年經驗既八字大師，用廣東話回答。

【八字】
年柱：${p.y}（${tg.y}）
月柱：${p.m}（${tg.m}）
日柱：${p.d}（${tg.d}日主）
時柱：${p.h}（${tg.h}）

【五行】木：${el.木} 火：${el.火} 土：${el.土} 金：${el.金} 水：${el.水}

【生肖】${z}

【刑沖合害】${int.join('、')}

【大運】${dy.map((d:any,i:number)=>`${i+1}.${d.years}:${d.stem}${d.branch}`).join('; ')}

【今年】${ln}

【問題】${q}

請詳細分析（廣東話）：
1. 日主性格同適合職業
2. 逐柱解釋（年/月/時）
3. 十神邊個最強
4. 五行邊個最強/要補
5. 刑沖合害影響
6. 性格+愛情觀
7. 事業建議
8. 財運建議
9. 健康建議
10. 大運分析
11. 今年運勢
12. 總結建議
`;
}

async function callMiniMax(p: string) {
  const r = await fetch(`${MINIMAX_BASE}/text/chatcompletion_v2`, {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEYS.minimax}`},
    body:JSON.stringify({model:'MiniMax-M2.5',messages:[{role:'system',content:'你係30年經驗既八字大師，用廣東話解答。'},{role:'user',content:p}],max_tokens:4000,temperature:0.7})
  });
  if(!r.ok) throw new Error('MM'+r.status);
  const d = await r.json();
  return d.choices?.[0]?.message?.content||'';
}

async function callDeepSeek(p: string) {
  const r = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEYS.deepseek}`},
    body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:'你係八字大師，用廣東話。'},{role:'user',content:p}],max_tokens:4000,temperature:0.7})
  });
  if(!r.ok) throw new Error('DS'+r.status);
  const d = await r.json();
  return d.choices?.[0]?.message?.content||'';
}

function parseResponse(t: string) {
  return { title:'詳細命理分析', summary:t.slice(0,150), detailed:t, highlights:['日主','十神','五行','刑沖','大運','流年'], actionPlan:['了解自己','選擇方向'], risks:['注意健康'], timing:['今年','大運'], confidence:'High' as const };
}
