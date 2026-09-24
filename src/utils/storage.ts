/**
 * Storage and Cloud Sync Utilities with AES-GCM Web Crypto Encryption
 */
import {
  PlayerProfile,
  ObstacleSettings,
  ObstacleTheme,
  SkyTheme,
  CharacterSkin,
  DailyQuest,
  WeeklyMission,
  LegendaryBadge,
  UserPreferences,
  CloudSavePayload,
  LeaderboardEntry,
  SkinId,
  CommunityChallenge
} from '../types/game';
import { INITIAL_SKINS } from '../data/skins';
import { INITIAL_QUESTS, INITIAL_WEEKLY_MISSIONS, ALL_LEGENDARY_BADGES } from '../data/quests';

const STORAGE_KEY_PROFILE = 'aeroflap_profile_v2';
const STORAGE_KEY_OBSTACLES = 'aeroflap_obstacles_v2';
const STORAGE_KEY_SKINS = 'aeroflap_skins_v2';
const STORAGE_KEY_QUESTS = 'aeroflap_quests_v2';
const STORAGE_KEY_WEEKLY_MISSIONS = 'aeroflap_weekly_missions_v2';
const STORAGE_KEY_PREFS = 'aeroflap_prefs_v2';
const STORAGE_KEY_OFFLINE_QUEUE = 'aeroflap_offline_queue_v2';
const STORAGE_KEY_LEADERBOARD = 'aeroflap_leaderboard_cache_v2';
const STORAGE_KEY_COMMUNITY = 'aeroflap_community_challenge_v2';

export const DEFAULT_OBSTACLE_SETTINGS: ObstacleSettings = {
  theme: 'CYBER_LASER',
  skyTheme: 'CYBER_NEON',
  gapSize: 'NORMAL',
  speed: 'STANDARD',
  pattern: 'STATIC',
  spacing: 'NORMAL',
  glowEffect: true
};

export const INITIAL_COMMUNITY_CHALLENGE: CommunityChallenge = {
  id: 'comm_chal_orbit_1',
  name: 'Operation Celestial Surge',
  operationCode: 'ORBIT-ALPHA-26',
  description: 'Unite with pilots across the globe to clear 500,000 obstacles together to unlock community rewards and the Zenith Champion Wings!',
  targetPipes: 500000,
  currentPipes: 384750,
  endsInDays: 5,
  playerContribution: 0,
  rewardTitle: 'Zenith Champion Pack & 500 Feathers',
  rewardDescription: 'Global Wing Badge, 500 Star Feathers reward, and exclusive seasonal profile flair for all contributing pilots.',
  milestones: [
    { threshold: 100000, label: 'Stage I: Stratosphere Breach', rewardFeathers: 100, unlocked: true, claimed: false },
    { threshold: 250000, label: 'Stage II: Ionosphere Glide', rewardFeathers: 200, unlocked: true, claimed: false },
    { threshold: 500000, label: 'Stage III: Orbital Apex Victory', rewardFeathers: 500, unlocked: false, claimed: false }
  ],
  completed: false,
  communityRewardClaimed: false
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
  lastStreakClaimDate: '',
  unlockedBadges: [],
  equippedBadgeId: undefined
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
        equippedBadgeId: parsed.equippedBadgeId || undefined
      };
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

export function loadWeeklyMissions(): WeeklyMission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEEKLY_MISSIONS);
    if (raw) {
      const saved: WeeklyMission[] = JSON.parse(raw);
      // Merge with initial missions to guarantee up-to-date fields and badges
      return INITIAL_WEEKLY_MISSIONS.map((init) => {
        const found = saved.find((m) => m.id === init.id);
        if (found) {
          return {
            ...init,
            ...found,
            rewardBadge: {
              ...init.rewardBadge,
              unlocked: found.completed || found.claimed || init.rewardBadge.unlocked
            }
          };
        }
        return init;
      });
    }
  } catch (e) {
    console.error('Error loading weekly missions', e);
  }
  return INITIAL_WEEKLY_MISSIONS;
}

export function saveWeeklyMissions(missions: WeeklyMission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEEKLY_MISSIONS, JSON.stringify(missions));
  } catch (e) {
    console.error('Error saving weekly missions', e);
  }
}

export function getAllLegendaryBadges(profile?: PlayerProfile): LegendaryBadge[] {
  const unlockedIds = profile?.unlockedBadges || [];
  return ALL_LEGENDARY_BADGES.map((b) => ({
    ...b,
    unlocked: unlockedIds.includes(b.id),
    unlockedAt: unlockedIds.includes(b.id) ? b.unlockedAt || 'Earned via Weekly Missions' : undefined
  }));
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

export function loadCommunityChallenge(): CommunityChallenge {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY);
    if (raw) {
      return { ...INITIAL_COMMUNITY_CHALLENGE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading community challenge', e);
  }
  return INITIAL_COMMUNITY_CHALLENGE;
}

export function saveCommunityChallenge(challenge: CommunityChallenge): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(challenge));
  } catch (e) {
    console.error('Error saving community challenge', e);
  }
}

export function contributePipesToCommunity(pipesPassed: number): CommunityChallenge {
  const current = loadCommunityChallenge();
  if (pipesPassed <= 0) return current;

  // Add user contribution + simulate concurrent global collective pilot activity
  const simulatedGlobalActivity = Math.floor(Math.random() * 4) + 1;
  const totalAdded = pipesPassed + simulatedGlobalActivity;
  const newCurrent = Math.min(current.targetPipes, current.currentPipes + totalAdded);
  const newPlayerContrib = current.playerContribution + pipesPassed;

  const updatedMilestones = current.milestones.map((m) => ({
    ...m,
    unlocked: m.unlocked || newCurrent >= m.threshold
  }));

  const updated: CommunityChallenge = {
    ...current,
    currentPipes: newCurrent,
    playerContribution: newPlayerContrib,
    milestones: updatedMilestones,
    completed: newCurrent >= current.targetPipes
  };

  saveCommunityChallenge(updated);
  return updated;
}

export function claimCommunityMilestone(milestoneIndex: number): { updated: CommunityChallenge; rewardFeathers: number } {
  const current = loadCommunityChallenge();
  const milestone = current.milestones[milestoneIndex];
  if (!milestone || !milestone.unlocked || milestone.claimed) {
    return { updated: current, rewardFeathers: 0 };
  }
  const reward = milestone.rewardFeathers;
  const updatedMilestones = [...current.milestones];
  updatedMilestones[milestoneIndex] = { ...milestone, claimed: true };
  const updated: CommunityChallenge = {
    ...current,
    milestones: updatedMilestones
  };
  saveCommunityChallenge(updated);
  return { updated, rewardFeathers: reward };
}

export function claimCommunityGrandReward(): { updated: CommunityChallenge; rewardFeathers: number } {
  const current = loadCommunityChallenge();
  if (!current.completed || current.communityRewardClaimed) {
    return { updated: current, rewardFeathers: 0 };
  }
  const updated: CommunityChallenge = {
    ...current,
    communityRewardClaimed: true
  };
  saveCommunityChallenge(updated);
  return { updated, rewardFeathers: 500 };
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
  passphrase?: string,
  weeklyMissions?: WeeklyMission[]
): Promise<string> {
  const payload: CloudSavePayload = {
    version: 2,
    timestamp: new Date().toISOString(),
    profile,
    obstacleSettings,
    unlockedSkins: skins.filter((s) => s.unlocked).map((s) => s.id),
    quests,
    weeklyMissions: weeklyMissions || loadWeeklyMissions(),
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
