# yun-seeker — Submission Summary (Monolith / Solana Mobile)

## One-liner
**yun-seeker** is a Solana Mobile-first destiny assistant that turns a user’s birth profile into personalized question-driven insights with wallet-native onboarding and shareable reports.

## Problem
Most astrology apps are generic, ad-heavy, and disconnected from user-owned identity. Users want personalized guidance with a clean mobile experience.

## Solution
yun-seeker combines:
- profile-based calculation inputs (birth date/time/place)
- question-driven insight generation (default + custom prompts)
- Solana wallet-native onboarding (Seeker-first)
- persistent dashboard + report history
- polished report presentation + share/export flow

## Core user flow
1. Welcome
2. Sign-in/sign-up (MVP email gate)
3. Connect SOL wallet (Seeker-first)
4. Profile setup + confirmation (timezone sanity check)
5. Dashboard stores profile and reports
6. Ask via defaults or custom question
7. Calculation uses stored profile context
8. Result screen shows highlights/confidence/details

## Why Solana Mobile
- Native wallet connection and identity path for mobile users
- Designed around mobile wallet behavior and fallback handling
- Built as a practical mobile dApp experience, not just web wrapped in mobile

## Technical highlights
- React Native + Expo
- Solana Mobile Wallet Adapter integration
- Modular architecture (`src/app/*`, `src/screens/*`)
- Local-first persistence (AsyncStorage)
- Optional Supabase sync layer (`.env.example`, `supabase/schema.sql`)

## Current status
### Working now
- End-to-end UX flow from onboarding to report
- Profile persistence + report history
- Share/export report
- Wallet connect primary path + fallback attempt

### Next upgrades
- Full fallback wallet adapter integration
- Production auth + row-level secure backend policies
- richer report visualizations + confidence model refinement

## Repo
https://github.com/jmr0ck/yun-seeker
