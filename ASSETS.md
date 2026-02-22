# yun App Assets Generation

## Overview

This script generates pixel art assets for the yun astrology app using xAI's image generation API.

## Setup

1. Set your xAI API key:
```bash
export XAI_API_KEY=your_xai_api_key
```

2. Run the generator:
```bash
python3 scripts/generate_assets.py
```

## Generated Assets

### Logos
- `yun_logo_main.png` - Main app logo (1:1)
- `yun_logo_icon.png` - Small icon (1:1)
- `yun_splash.png` - Splash screen (9:16)

### Icons
- `icon_birth_chart.png` - Birthday cake
- `icon_question.png` - Crystal ball
- `icon_love.png` - Hearts
- `icon_finance.png` - Money bag
- `icon_lottery.png` - Lottery balls
- `icon_zodiac.png` - Zodiac

## Style Requirements

All assets must follow:

1. **Pixel Art** - 8-bit retro gaming aesthetic
2. **Color Palette**:
   - Primary: Gold/Yellow (#FFD700)
   - Background: Dark (#0D0D0D, #1F1F1F)
   - Accents: Purple (#9945FF)
3. **Theme**: Chinese mysticism + Web3/Crypto
4. **CT Popular**: Trending on crypto Twitter

## Tech Stack

- xAI grok-imagine-image model
- Pixel art style
- 1:1 and 9:16 aspect ratios
