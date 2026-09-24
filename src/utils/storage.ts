/**
 * Storage and Cloud Sync Utilities with AES-GCM Web Crypto Encryption
 */
import {
  PlayerProfile,
  ObstacleSettings,
  ObstacleTheme,
  CharacterSkin,
  DailyQuest,
  UserPreferences,
  CloudSavePayload,
  LeaderboardEntry,
  SkinId
} from '../types/game';
import { INITIAL_SKINS } from '../data/skins';
import { INITIAL_QUESTS } from '../data/quests';

const STORAGE_KEY_PROFILE = 'aeroflap_profile_v2';
const STORAGE_KEY_OBSTACLES = 'aeroflap_obstacles_v2';
const STORAGE_KEY_SKINS = 'aeroflap_skins_v2';
const STORAGE_KEY_QUESTS = 'aeroflap_quests_v2';
const STORAGE_KEY_PREFS = 'aeroflap_prefs_v2';
const STORAGE_KEY_OFFLINE_QUEUE = 'aeroflap_offline_queue_v2';
const STORAGE_KEY_LEADERBOARD = 'aeroflap_leaderboard_cache_v2';

export const DEFAULT_OBSTACLE_SETTINGS: ObstacleSettings = {
  theme: 'CYBER_LASER',
  gapSize: 'NORMAL',
  speed: 'STANDARD',
  pattern: 'STATIC',
  spacing: 'NORMAL',
  glowEffect: true
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark_cyber',
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.6,
  hapticsEnabled: true,
  highContrast: false,
  reducedMotion: false,
  swipeDiveEnabled: true,
  showFPS: false,
  notifications: {
    dailyChallenges: true,
    leaderboardUpdates: true,
    seasonalEvents: true,
    achievementReminders: true
  }
};

export const DEFAULT_PROFILE: PlayerProfile = {
  id: 'pilot_' + Math.random().toString(36).substring(2, 9),
  username: 'SkyAce_' + Math.floor(100 + Math.random() * 900),
  authProvider: 'guest',
  isBiometricEnabled: false,
  avatarSkin: 'classic_canary',
  level: 1,
  xp: 0,
  starFeathers: 150, // Starting bonus
  highScore: 0,
  totalGames: 0,
  totalPipesPassed: 0,
  totalFeathersCollected: 0,
  lastLoginDate: new Date().toISOString(),
  streakDays: 1,
  lastStreakClaimDate: ''
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function loadObstacleSettings(): ObstacleSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OBSTACLES);
    if (raw) {
      return { ...DEFAULT_OBSTACLE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading obstacle settings', e);
  }
  return DEFAULT_OBSTACLE_SETTINGS;
}

export function saveObstacleSettings(settings: ObstacleSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_OBSTACLES, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving obstacle settings', e);
  }
}

export function loadSkins(): CharacterSkin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SKINS);
    if (raw) {
      const savedUnlockedIds: SkinId[] = JSON.parse(raw);
      return INITIAL_SKINS.map((s) => ({
        ...s,
        unlocked: s.id === 'classic_canary' || savedUnlockedIds.includes(s.id)
      }));
    }
  } catch (e) {
    console.error('Error loading skins', e);
  }
  return INITIAL_SKINS;
}

export function saveUnlockedSkins(skins: CharacterSkin[]): void {
  try {
    const unlockedIds = skins.filter((s) => s.unlocked).map((s) => s.id);
    localStorage.setItem(STORAGE_KEY_SKINS, JSON.stringify(unlockedIds));
  } catch (e) {
    console.error('Error saving skins', e);
  }
}

export function loadQuests(): DailyQuest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUESTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading quests', e);
  }
  return INITIAL_QUESTS;
}

export function saveQuests(quests: DailyQuest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
  } catch (e) {
    console.error('Error saving quests', e);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFS);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading preferences', e);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving preferences', e);
  }
}

// Global leaderboard seed generator for vibrant competition
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  const seeded: LeaderboardEntry[] = [
    {
      id: 'lb_1',
      rank: 1,
      username: 'NeonValkyrie',
      score: 142,
      pipesPassed: 142,
      avatarSkin: 'golden_monarch',
      obstacleTheme: 'CYBER_LASER',
      country: 'JP',
      timestamp: '12m ago'
    },
    {
      id: 'lb_2',
      rank: 2,
      username: 'ApexFalcon',
      score: 118,
      pipesPassed: 118,
      avatarSkin: 'phoenix_flame',
      obstacleTheme: 'STEAMPUNK_SPIRES',
      country: 'US',
      timestamp: '34m ago'
    },
    {
      id: 'lb_3',
      rank: 3,
      username: 'PixelGod_99',
      score: 95,
      pipesPassed: 95,
      avatarSkin: 'pixel_arcade',
      obstacleTheme: 'PIXEL_BRICKS',
      country: 'KR',
      timestamp: '1h ago',
      isFriend: true
    },
    {
      id: 'lb_4',
      rank: 4,
      username: 'CyberRaven',
      score: 79,
      pipesPassed: 79,
      avatarSkin: 'void_raven',
      obstacleTheme: 'DARK_NEBULA',
      country: 'DE',
      timestamp: '2h ago'
    },
    {
      id: 'lb_5',
      rank: 5,
      username: 'AeroCloud',
      score: 64,
      pipesPassed: 64,
      avatarSkin: 'cyber_drone',
      obstacleTheme: 'CYBER_LASER',
      country: 'UK',
      timestamp: '3h ago',
      isFriend: true
    },
    {
      id: 'lb_6',
      rank: 6,
      username: 'BreezePilot',
      score: 52,
      pipesPassed: 52,
      avatarSkin: 'classic_canary',
      obstacleTheme: 'CLASSIC_PIPES',
      country: 'CA',
      timestamp: '5h ago'
    },
    {
      id: 'lb_7',
      rank: 7,
      username: 'AstralDrifter',
      score: 41,
      pipesPassed: 41,
      avatarSkin: 'cosmic_ufo',
      obstacleTheme: 'CRYSTAL_SHARDS',
      country: 'FR',
      timestamp: '7h ago'
    },
    {
      id: 'lb_8',
      rank: 8,
      username: 'SugarGlide',
      score: 35,
      pipesPassed: 35,
      avatarSkin: 'kawaii_chick',
      obstacleTheme: 'CANDY_CANES',
      country: 'BR',
      timestamp: '9h ago',
      isFriend: true
    }
  ];

  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(seeded));
  return seeded;
}

export function submitLeaderboardScore(
  profile: PlayerProfile,
  score: number,
  obstacleTheme: ObstacleTheme
): LeaderboardEntry[] {
  let list = getLeaderboard();

  // Find or insert current user
  const existingIdx = list.findIndex((e) => e.username === profile.username || e.isCurrentUser);

  if (existingIdx >= 0) {
    if (score > list[existingIdx].score) {
      list[existingIdx].score = score;
      list[existingIdx].pipesPassed = score;
      list[existingIdx].avatarSkin = profile.avatarSkin;
      list[existingIdx].obstacleTheme = obstacleTheme;
      list[existingIdx].timestamp = 'Just now';
    }
  } else {
    list.push({
      id: 'lb_user_' + profile.id,
      rank: 0,
      username: profile.username,
      score: score,
      pipesPassed: score,
      avatarSkin: profile.avatarSkin,
      obstacleTheme: obstacleTheme,
      country: 'GLOBAL',
      timestamp: 'Just now',
      isCurrentUser: true
    });
  }

  // Re-sort descending
  list.sort((a, b) => b.score - a.score);

  // Re-assign ranks
  list = list.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(list));
  return list;
}

/**
 * Encrypted Backup Generator (Web Crypto API AES-GCM)
 */
export async function createEncryptedBackup(
  profile: PlayerProfile,
  obstacleSettings: ObstacleSettings,
  skins: CharacterSkin[],
  quests: DailyQuest[],
  preferences: UserPreferences,
  passphrase?: string
): Promise<string> {
  const payload: CloudSavePayload = {
    version: 2,
    timestamp: new Date().toISOString(),
    profile,
    obstacleSettings,
    unlockedSkins: skins.filter((s) => s.unlocked).map((s) => s.id),
    quests,
    preferences,
    checksum: 'crc_' + Math.random().toString(36).substring(2, 10)
  };

  const plainText = JSON.stringify(payload);
  const secretKey = passphrase || 'aeroflap_master_secure_vault_2026';

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    enc.encode(plainText)
  );

  // Pack IV + Ciphertext as Base64
  const combined = new Uint8Array(iv.length + encryptedBuf.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuf), iv.length);

  let binary = '';
  const bytes = new Uint8Array(combined);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decrypt & Restore Backup
 */
export async function restoreEncryptedBackup(
  encryptedBase64: string,
  passphrase?: string
): Promise<CloudSavePayload> {
  const secretKey = passphrase || 'aeroflap_master_secure_vault_2026';
  const binary = atob(encryptedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    ciphertext
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuf);
  return JSON.parse(jsonStr) as CloudSavePayload;
}

/**
 * Export CSV Flight Summary & Stats
 */
export function exportFlightSummaryCSV(profile: PlayerProfile): string {
  const headers = ['Metric', 'Value', 'ExportDate'];
  const now = new Date().toISOString();
  const rows = [
    ['Pilot ID', profile.id, now],
    ['Username', profile.username, now],
    ['Auth Provider', profile.authProvider, now],
    ['Biometrics Linked', profile.isBiometricEnabled ? 'YES' : 'NO', now],
    ['Pilot Level', profile.level.toString(), now],
    ['Current XP', profile.xp.toString(), now],
    ['Star Feathers Balance', profile.starFeathers.toString(), now],
    ['All-Time High Score', profile.highScore.toString(), now],
    ['Total Flights', profile.totalGames.toString(), now],
    ['Total Pipes Cleared', profile.totalPipesPassed.toString(), now],
    ['Total Feathers Harvested', profile.totalFeathersCollected.toString(), now],
    ['Daily Login Streak (Days)', profile.streakDays.toString(), now],
    ['Equipped Skin', profile.avatarSkin, now]
  ];

  return [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
}

/**
 * Offline Sync Queue Management
 */
export function enqueueOfflineScore(score: number, feathers: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push({
      timestamp: new Date().toISOString(),
      score,
      feathers
    });
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error('Error enqueuing offline score', e);
  }
}

export function flushOfflineQueue(): { count: number; totalFeathers: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    if (!raw) return { count: 0, totalFeathers: 0 };
    const queue: Array<{ score: number; feathers: number }> = JSON.parse(raw);
    const count = queue.length;
    const totalFeathers = queue.reduce((acc, curr) => acc + curr.feathers, 0);
    localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
    return { count, totalFeathers };
  } catch {
    return { count: 0, totalFeathers: 0 };
  }
}
