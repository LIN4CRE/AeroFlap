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

export type SkyTheme =
  | 'CYBER_NEON'
  | 'SUNSET_HORIZON'
  | 'ARCTIC_STORM'
  | 'DARK_NEBULA'
  | 'DAYLIGHT_AZURE'
  | 'RETRO_AMBER';

export type GapSize = 'EASY' | 'NORMAL' | 'HARD' | 'CHAOS_DYNAMIC';
export type ObstacleSpeed = 'CHILL' | 'STANDARD' | 'HYPER' | 'PROGRESSIVE';
export type ObstaclePattern = 'STATIC' | 'VERTICAL_BOB' | 'ROTATING_PULSE';
export type ObstacleSpacing = 'WIDE' | 'NORMAL' | 'TIGHT';

export interface ObstacleSettings {
  theme: ObstacleTheme;
  skyTheme: SkyTheme;
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

export interface LegendaryBadge {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tier: 'Legendary';
  icon: string;
  glowColor: string;
  accentBorder: string;
  unlocked: boolean;
  unlockedAt?: string;
  prestigePoints: number;
}

export type WeeklyMissionType =
  | 'CUMULATIVE_PIPES'
  | 'COLLECT_FEATHERS'
  | 'HIGH_SCORE_SINGLE'
  | 'TOTAL_GAMES'
  | 'THEMED_PIPES';

export interface WeeklyMission {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardFeathers: number;
  rewardXP: number;
  rewardBadge: LegendaryBadge;
  completed: boolean;
  claimed: boolean;
  type: WeeklyMissionType;
  themeReq?: ObstacleTheme;
  difficulty: 'Hard' | 'Extreme' | 'Master';
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
  unlockedBadges?: string[];
  equippedBadgeId?: string;
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

export interface CommunityMilestone {
  threshold: number;
  label: string;
  rewardFeathers: number;
  unlocked: boolean;
  claimed: boolean;
}

export interface CommunityChallenge {
  id: string;
  name: string;
  operationCode: string;
  description: string;
  targetPipes: number;
  currentPipes: number;
  endsInDays: number;
  playerContribution: number;
  rewardTitle: string;
  rewardDescription: string;
  milestones: CommunityMilestone[];
  completed: boolean;
  communityRewardClaimed: boolean;
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
  weeklyMissions?: WeeklyMission[];
  preferences: UserPreferences;
  checksum: string;
}
