import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile, ReadingResult } from './types';
import { STORAGE_KEYS } from './constants';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

async function supabaseUpsert(table: string, payload: any) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return;
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(payload),
  });
}

export async function loadBootstrap() {
  const [rawProfile, rawReports, rawEmail] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
    AsyncStorage.getItem(STORAGE_KEYS.REPORTS),
    AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL),
  ]);

  return {
    email: rawEmail || '',
    profile: rawProfile ? (JSON.parse(rawProfile) as Profile) : null,
    reports: rawReports ? (JSON.parse(rawReports) as ReadingResult[]) : [],
  };
}

export async function saveEmail(email: string) {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
}

export async function saveProfile(email: string, profile: Profile) {
  await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  try {
    await supabaseUpsert('profiles', [{ email, ...profile, updated_at: new Date().toISOString() }]);
  } catch {
    // keep local-first behavior
  }
}

export async function saveReports(email: string, reports: ReadingResult[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  try {
    const latest = reports[0];
    if (latest) {
      await supabaseUpsert('reports', [
        {
          email,
          asked_at: latest.askedAt,
          title: latest.title,
          question: latest.question,
          summary: latest.summary,
          confidence: latest.confidence,
          focus: latest.focus,
          highlights: latest.highlights,
          payload: latest.data,
        },
      ]);
    }
  } catch {
    // keep local-first behavior
  }
}
