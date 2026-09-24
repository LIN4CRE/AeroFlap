/**
 * AeroFlap Game Type Definitions
 */

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type ObstacleTheme = 
  | 'CLASSIC_PIPES'
  | 'CYBER_LASER'
  | 'STEAMPUNK_SPIRES'
  | 'PIXEL_BRICKS'
  | 'CRYSTAL_SHARDS'
  | 'CANDY_CANES'
  | 'DARK_NEBULA';

export type GapSize = 'EASY' | 'NORMAL' | 'HARD' | 'CHAOS_DYNAMIC';
export type ObstacleSpeed = 'CHILL' | 'STANDARD' | 'HYPER' | 'PROGRESSIVE';
export type ObstaclePattern = 'STATIC' | 'VERTICAL_BOB' | 'ROTATING_PULSE';
export type ObstacleSpacing = 'WIDE' | 'NORMAL' | 'TIGHT';

export interface ObstacleSettings {
  theme: ObstacleTheme;
  gapSize: GapSize;
  speed: ObstacleSpeed;
  pattern: ObstaclePattern;
  spacing: ObstacleSpacing;
  customColor?: string;
  glowEffect: boolean;
}

export type SkinId = 
  | 'classic_canary'
  | 'cyber_drone'
  | 'phoenix_flame'
  | 'golden_monarch'
  | 'pixel_arcade'
  | 'void_raven'
  | 'steampunk_aviator'
  | 'ethereal_ghost'
  | 'kawaii_chick'
  | 'cosmic_ufo';

export interface CharacterSkin {
  id: SkinId;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Seasonal';
  costFeathers: number;
  levelReq: number;
  particleType: 'feathers' | 'cyber_trail' | 'fire_embers' | 'gold_stars' | 'retro_pixels' | 'void_runes' | 'steam_puff' | 'ghost_mist' | 'pink_hearts' | 'cosmic_rings';
  pitchModifier: number; // for procedural audio flap pitch
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  email?: string;
  authProvider: 'google' | 'apple' | 'biometric' | 'guest';
  isBiometricEnabled: boolean;
  avatarSkin: SkinId;
  level: number;
  xp: number;
  starFeathers: number;
  highScore: number;
  totalGames: number;
  totalPipesPassed: number;
  totalFeathersCollected: number;
  lastLoginDate: string;
  streakDays: number;
  lastStreakClaimDate: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  pipesPassed: number;
  avatarSkin: SkinId;
  obstacleTheme: ObstacleTheme;
  country: string;
  timestamp: string;
  isCurrentUser?: boolean;
  isFriend?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardFeathers: number;
  rewardXP: number;
  completed: boolean;
  claimed: boolean;
  type: 'SCORE_SINGLE' | 'COLLECT_FEATHERS' | 'PLAY_GAMES' | 'THEMED_RUN';
  themeReq?: ObstacleTheme;
}

export interface SeasonalEvent {
  seasonNumber: number;
  name: string;
  description: string;
  endsInDays: number;
  currentTier: number;
  maxTier: number;
  tierXP: number;
  tierMaxXP: number;
  exclusiveSkinId: SkinId;
}

export type AppTheme = 'dark_cyber' | 'daylight' | 'sunset' | 'retro_amber';

export interface UserPreferences {
  theme: AppTheme;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  swipeDiveEnabled: boolean;
  showFPS: boolean;
  notifications: {
    dailyChallenges: boolean;
    leaderboardUpdates: boolean;
    seasonalEvents: boolean;
    achievementReminders: boolean;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'daily' | 'leaderboard' | 'season' | 'achievement';
  read: boolean;
  actionUrl?: string;
}

export interface CloudSavePayload {
  version: number;
  timestamp: string;
  profile: PlayerProfile;
  obstacleSettings: ObstacleSettings;
  unlockedSkins: SkinId[];
  quests: DailyQuest[];
  preferences: UserPreferences;
  checksum: string;
}
