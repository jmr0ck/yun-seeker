#!/usr/bin/env python3
"""
xAI Image Generator for yun app assets
Generates pixel art logos and assets for the astrology app
"""

import os
import requests
import base64
import json
from datetime import datetime

# Config
XAI_API_KEY = os.environ.get('XAI_API_KEY', '')
OUTPUT_DIR = '/home/jmr0ck_jm/.openclaw/workspace/yun-seeker/assets'

# yun app logo prompts (pixel art, CT/web3 style)
LOGO_PROMPTS = [
    {
        'name': 'yun_logo_main',
        'prompt': '''Pixel art logo of Chinese character "運" (yun meaning luck/destiny) 
        in retro 8-bit pixel art style, dark background with golden/yellow glow,
        mystical aura, blockchain crypto aesthetic, solana mobile style,
        vibrant colors, high contrast, trending on CT crypto Twitter''',
        'aspect': '1:1',
        'resolution': '1k'
    },
    {
        'name': 'yun_logo_icon',
        'prompt': '''Minimalist pixel art icon of Chinese character "運" 
        simple 16x16 or 32x32 pixel art, golden yellow on black,
        crypto aesthetic, tiny detail, web3 defi icon style''',
        'aspect': '1:1',
        'resolution': '1k'
    },
    {
        'name': 'yun_splash',
        'prompt': '''Pixel art splash screen for astrology app called "yun" (運),
        ancient chinese mystical theme, stars and constellations,
        dark purple/black gradient background, golden chinese characters,
        solana mobile crypto aesthetic, 8-bit retro gaming style''',
        'aspect': '9:16',
        'resolution': '1k'
    }
]

# Feature icons (pixel art)
ICON_PROMPTS = [
    {
        'name': 'icon_birth_chart',
        'prompt': 'Pixel art icon of a birthday cake with candles, 8-bit style, golden yellow, dark background'
    },
    {
        'name': 'icon_question',
        'prompt': 'Pixel art icon of a crystal ball, fortune telling, 8-bit style, purple glow, dark background'
    },
    {
        'name': 'icon_love',
        'prompt': 'Pixel art icon of two hearts together, romantic, 8-bit style, pink/red, dark background'
    },
    {
        'name': 'icon_finance',
        'prompt': 'Pixel art icon of money bag with dollar sign, wealth, 8-bit style, gold, dark background'
    },
    {
        'name': 'icon_lottery',
        'prompt': 'Pixel art icon of lottery balls, numbers, 8-bit style, golden, dark background'
    },
    {
        'name': 'icon_zodiac',
        'prompt': 'Pixel art icon of Chinese zodiac animal silhouette, 12 animals, 8-bit style, golden, dark background'
    }
]


def generate_image(prompt, aspect='1:1', resolution='1k'):
    """Generate image using xAI API"""
    url = 'https://api.x.ai/v1/images/generations'
    headers = {
        'Authorization': f'Bearer {XAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'grok-imagine-image',
        'prompt': prompt,
        'aspect_ratio': aspect,
        'resolution': resolution,
        'n': 1,
        'response_format': 'b64_json'
    }
    
    print(f'Generating: {prompt[:50]}...')
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        print(f'Error: {response.status_code} - {response.text}')
        return None
    
    data = response.json()
    if 'data' in data and len(data['data']) > 0:
        return data['data'][0].get('b64_json')
    return None


def save_image(b64_data, filename):
    """Save base64 image to file"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    with open(filepath, 'wb') as f:
        f.write(base64.b64decode(b64_data))
    
    print(f'Saved: {filepath}')
    return filepath


def generate_yun_assets():
    """Generate all yun app assets"""
    if not XAI_API_KEY:
        print('ERROR: XAI_API_KEY not set')
        print('Set it with: export XAI_API_KEY=your_key')
        return
    
    print(f'Output directory: {OUTPUT_DIR}')
    print('=' * 50)
    print('Generating yun app assets...')
    print('=' * 50)
    
    # Generate logos
    print('\n📀 LOGOS:')
    for logo in LOGO_PROMPTS:
        b64 = generate_image(logo['prompt'], logo['aspect'], logo['resolution'])
        if b64:
            save_image(b64, f"{logo['name']}.png")
    
    # Generate icons
    print('\n🎨 ICONS:')
    for icon in ICON_PROMPTS:
        b64 = generate_image(icon['prompt'], '1:1', '1k')
        if b64:
            save_image(b64, f"{icon['name']}.png")
    
    print('\n✅ Done! Assets saved to:', OUTPUT_DIR)


if __name__ == '__main__':
    generate_yun_assets()
