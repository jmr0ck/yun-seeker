# yun - Technical Architecture

## Stack
- **Frontend:** React Native (Expo)
- **Blockchain:** Solana Mobile SDK
- **Backend:** TypeScript (yun engine)
- **Auth:** Solana Wallet Adapter

## Key Files
```
yun-seeker/
├── App.tsx              # Main UI
├── src/lib/             # Astrology engine
│   ├── luck.ts         # Main API
│   ├── fourPillars.ts  # 八字
│   ├── purpleStar.ts   # 紫微斗數
│   ├── fiveElements.ts # 五行
│   ├── chineseZodiac.ts# 生肖
│   └── lottery.ts      # Lucky numbers
├── scripts/             # Tools
│   └── generate_assets.py  # xAI image gen
└── app.json            # Expo config
```

## Features
1. Wallet connect (Solana)
2. Profile with birth data
3. Free daily readings
4. Premium unlocks (SOL)
5. Points system

## Data Flow
```
User → Wallet → App → Birth Data → yun Engine → Reading
                              ↓
                        Solana (payments/points)
```

## Privacy
- Birth data stored locally
- Location at city level only
- No personal data on chain

## Deployment
- Expo for building
- Target: Solana Mobile (Android APK)
