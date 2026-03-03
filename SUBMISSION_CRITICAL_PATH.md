# Yun-seeker — Submission Critical Path (living)

Last updated: 2026-03-02 ET

## ✅ Build proof
- `npm run build:android` ✅
- `npm run build:apk` ✅
- APK: `android/app/build/outputs/apk/release/app-release.apk`

## 0) Non-negotiables (must be true)
- App installs and launches on Seeker/Android
- Demo path completes end-to-end without a crash
- Wallet connect works on Seeker OR backup plan works flawlessly
- Report generation produces a “judge-impressive” result screen
- Share/export works

## 1) Demo path (run this 5x)
1. Welcome
2. Email sign-in (MVP)
3. Connect Seeker wallet
4. Enter birth profile
5. Confirm profile (timezone sanity)
6. Dashboard shows profile + report history
7. Ask default question
8. Ask custom question
9. Generate report
10. Share/export
11. Open old report from history

## 2) P0 bug definition
P0 = anything that breaks steps 1–11 or blocks install/launch.

## 3) Submission assets checklist
- [ ] 60–90s screen recording (Seeker device)
- [ ] 3–5 screenshots: welcome, wallet connect, profile confirm, report, dashboard/history
- [ ] Repo link
- [ ] 1-paragraph architecture (React Native/Expo + Solana Mobile Wallet Adapter + local-first + optional Supabase)
- [ ] “What’s working” vs “Next upgrades” (already in `SUBMISSION_SUMMARY.md`)

## 4) Backup plan (if wallet fails live)
- Use fallback wallet button
- Continue with saved profile
- Generate report + show history + share flow
- Explain wallet hardening roadmap
