#!/usr/bin/env node

/**
 * Yun-seeker Art Generator
 * Pixel art UI elements for the app - NPC, dialogue boxes, etc.
 * Uses xAI Grok Imagine
 */

const fs = require('fs');
const path = require('node:path');
const https = require('node:https');

const OUTPUT_DIR = '/home/jmr0ck_jm/.openclaw/workspace/yun-seeker/assets/pixel_art';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Pixel art style guide for yun-seeker
const STYLE_GUIDE = `
16-bit pixel art UI for Chinese astrology mobile app:
- Style: Retro game, 16-bit pixel, bold outlines
- Color palette: Deep blues, golds, reds, earthy tones
- Chinese aesthetic: Traditional motifs, ancient wisdom vibe
- NO text in images (UI elements only)
`;

// NPC and character prompts - Cute Pokemon-style characters
const ASSET_PROMPTS = {
  // Characters - Cute Pokemon style
  'sage_npc': 'cute pixel art character, Chinese sage spirit animal, small owl with traditional Chinese hat, big round eyes, friendly expression, fluffy feathers, holding tiny scroll, Pokemon-style, 16-bit, centered, kawaii',
  'dragon_spirit': 'cute pixel art Chinese dragon, small and friendly, big expressive eyes, tiny wings, cute smile, festive colors red gold green, Pokemon-style, 16-bit, centered, kawaii',
  'turtle_companion': 'cute pixel art turtle, traditional Chinese mythology turtle spirit, shell with mystical patterns, big eyes, friendly, small, Pokemon-style, 16-bit, centered, kawaii',
  'phoenix_bird': 'cute pixel art phoenix, small mystical bird, beautiful colorful feathers, happy expression, cute pose, Pokemon-style, 16-bit, centered, kawaii',
  'money_cat': 'cute pixel art fortune cat, traditional Chinese lucky cat, waving paw, big eyes, red gold colors, happy expression, Pokemon-style, 16-bit, centered, kawaii',
  'lion_dance': 'cute pixel art lion mascot, Chinese lion dance, friendly expression, small and round, red and gold, Pokemon-style, 16-bit, centered, kawaii',
  
  // UI Elements
  'dialogue_box': '16-bit pixel art dialogue box, retro game text window, dark blue background, white pixel border, space for text at bottom, retro game UI style, no text',
  'choice_button': '16-bit pixel art RPG choice button, gold border, green highlight, retro game menu style, selected state, no text',
  'choice_button_unselected': '16-bit pixel art RPG choice button, grey border, unselected state, retro game menu style, no text',
  
  // Screens
  'daily_reading_screen': '16-bit pixel art fortune reading screen, mystical background with stars and moon, ancient Chinese temple interior, retro game UI layout, dark blue and gold colors, no text',
  'lucky_numbers_screen': '16-bit pixel art lottery numbers screen, treasure chest with glowing numbers, festive red and gold, retro game reward style, no text',
  'birth_input_screen': '16-bit pixel art form input screen, ancient scroll with writing areas, retro game style, brown and cream colors, no text',
  
  // Backgrounds
  'main_menu_bg': '16-bit pixel art main menu background, Chinese temple gate at night, lantern lights, misty mountains, dark blue sky with stars, retro game title screen style',
  'reading_bg': '16-bit pixel art reading background, mystical void with floating symbols, ancient Chinese cosmology vibe, deep blue and gold particles, retro game',
  
  // Effects
  'glow_effect': '16-bit pixel art magical glow, golden light particles, positive energy effect, small sprite, retro game FX',
  'loading_animation': '16-bit pixel art loading spinner, rotating yin yang symbol, gold and black, retro game loading style',
};

// xAI API call
async function generateImage(prompt) {
  const fullPrompt = `${STYLE_GUIDE}\n\n${prompt}\n\n16-bit pixel art style, bold outlines, retro gaming aesthetic, Chinese traditional elements`;
  
  const payload = JSON.stringify({
    model: "grok-imagine-image",
    prompt: fullPrompt,
    image_size: "1024x1024",
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.x.ai',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data && json.data[0] && json.data[0].url) {
            resolve(json.data[0].url);
          } else {
            reject(new Error(`No image URL in response: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Download image
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Generate all assets
async function generateAll() {
  console.log('🎨 Yun-seeker Pixel Art Generator');
  console.log('==============================\n');
  
  for (const [name, prompt] of Object.entries(ASSET_PROMPTS)) {
    console.log(`Generating: ${name}...`);
    
    try {
      const imageUrl = await generateImage(prompt);
      const filename = path.join(OUTPUT_DIR, `${name}.png`);
      await downloadImage(imageUrl, filename);
      console.log(`  ✅ Saved: ${filename}\n`);
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}\n`);
    }
  }
  
  console.log('Done! Check:', OUTPUT_DIR);
}

// Generate single asset
async function generateOne(assetName) {
  const prompt = ASSET_PROMPTS[assetName];
  if (!prompt) {
    console.log('Available assets:', Object.keys(ASSET_PROMPTS).join(', '));
    return;
  }
  
  console.log(`Generating: ${assetName}...`);
  
  try {
    const imageUrl = await generateImage(prompt);
    const filename = path.join(OUTPUT_DIR, `${assetName}.png`);
    await downloadImage(imageUrl, filename);
    console.log(`✅ Saved: ${filename}`);
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  generateAll();
} else if (args[0] === 'list') {
  console.log('Available assets:');
  Object.keys(ASSET_PROMPTS).forEach(k => console.log(`  - ${k}`));
} else {
  generateOne(args[0]);
}
