# Hackathon Demo Checklist (yun-seeker)

## 1) Pre-demo setup (5 mins)
- [ ] `npm install`
- [ ] `npm run start`
- [ ] Open app on Solana Mobile / Android device
- [ ] Ensure Seeker wallet is installed and can open
- [ ] (Optional) `.env` configured for Supabase sync

## 2) Demo storyline (2-4 mins)
1. Welcome screen → explain value in one line
2. Sign-in (email MVP) → mention account continuity
3. Connect Seeker wallet → wallet identity + web3-native flow
4. Enter profile (birth date/time/place + optional current location)
5. Confirm profile screen (timezone sanity check)
6. Dashboard stores profile + report history
7. Question screen:
   - tap a default question
   - ask one custom question
8. Generate report → “impressive” result UI
9. Share/export report via native share sheet
10. Open an older report from dashboard history

## 3) Key judging points to emphasize
- Solana Mobile-first wallet flow (Seeker)
- Real user utility: personalized astro guidance
- Structured UX from onboarding → action → output
- Persistent user profile and reusable context
- Clean architecture refactor (modular app/screens)
- Optional cloud sync (Supabase-ready, local-first fallback)

## 4) Backup plan (if live wallet fails)
- Use “Other Wallets (Fallback)” button
- Continue UX walkthrough with pre-saved profile
- Showcase report generation + history + share flow
- Explain wallet integration path and production hardening roadmap

## 5) Final submission assets
- [ ] 60-90s screen recording
- [ ] 3-5 screenshots (welcome, wallet, profile confirm, report)
- [ ] Repo link
- [ ] Short architecture paragraph
- [ ] What’s working vs next-up
