/**
 * User Profile Management
 * 
 * Save and load user profiles for quick access
 */

import * as fs from 'fs';
import * as path from 'path';

export interface UserProfile {
  name: string;
  birthDate: string;  // YYYY-MM-DD
  birthTime: number;  // Hour (0-23)
  birthplace: string;
  timezone: string;
  createdAt: string;
}

const PROFILE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', '.yun');
const PROFILE_FILE = path.join(PROFILE_DIR, 'profile.json');

/**
 * Ensure profile directory exists
 */
function ensureProfileDir() {
  if (!fs.existsSync(PROFILE_DIR)) {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
  }
}

/**
 * Save user profile
 */
export function saveProfile(profile: UserProfile): boolean {
  try {
    ensureProfileDir();
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to save profile:', e);
    return false;
  }
}

/**
 * Load user profile
 */
export function loadProfile(): UserProfile | null {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }
  return null;
}

/**
 * Delete user profile
 */
export function deleteProfile(): boolean {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      fs.unlinkSync(PROFILE_FILE);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if profile exists
 */
export function hasProfile(): boolean {
  return fs.existsSync(PROFILE_FILE);
}

/**
 * CLI commands for profile management
 */
export function cmdProfile(args: string[]) {
  const subcommand = args[0];
  
  if (!subcommand || subcommand === 'show') {
    const profile = loadProfile();
    if (!profile) {
      console.log('\n❌ No profile found. Create one with:');
      console.log('   yun profile set <name> <birth-date> <birth-time> <birthplace>');
      console.log('   Example: yun profile set "Guang Ming He" 1982-12-12 4 "Kaiping, China"');
      return;
    }
    
    console.log('\n👤 Your Profile');
    console.log('='.repeat(40));
    console.log(`   Name: ${profile.name}`);
    console.log(`   Birth: ${profile.birthDate} @ ${profile.birthTime}:00`);
    console.log(`   Place: ${profile.birthplace}`);
    console.log(`   Timezone: ${profile.timezone}`);
    console.log(`   Created: ${profile.createdAt}`);
    return;
  }
  
  if (subcommand === 'set') {
    // yun profile set "Name" YYYY-MM-DD HH "Place"
    const name = args[1];
    const birthDate = args[2];
    const birthTime = args[3];
    const birthplace = args.slice(4).join(' ');
    
    if (!name || !birthDate || !birthTime) {
      console.log('\nUsage: yun profile set <name> <birth-date> <birth-time> <birthplace>');
      console.log('Example: yun profile set "Guang Ming He" 1982-12-12 4 "Kaiping, China"');
      return;
    }
    
    const profile: UserProfile = {
      name,
      birthDate,
      birthTime: parseInt(birthTime),
      birthplace: birthplace || 'Unknown',
      timezone: 'Asia/Hong_Kong',
      createdAt: new Date().toISOString(),
    };
    
    if (saveProfile(profile)) {
      console.log('\n✅ Profile saved!');
      console.log(`   Name: ${profile.name}`);
      console.log(`   Birth: ${profile.birthDate} @ ${profile.birthTime}:00`);
      console.log(`   Place: ${profile.birthplace}`);
    } else {
      console.log('\n❌ Failed to save profile');
    }
    return;
  }
  
  if (subcommand === 'delete') {
    if (deleteProfile()) {
      console.log('\n✅ Profile deleted');
    } else {
      console.log('\n❌ Failed to delete profile');
    }
    return;
  }
  
  console.log('\n📖 Profile Commands:');
  console.log('   yun profile show              Show current profile');
  console.log('   yun profile set <name> <date> <time> <place>  Create profile');
  console.log('   yun profile delete            Delete profile');
}

export default cmdProfile;
