import { DailyQuest, SeasonalEvent, WeeklyMission, LegendaryBadge } from '../types/game';

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest_score_15',
    title: 'Precision Aviator',
    description: 'Fly through 15 obstacles in a single flight session.',
    targetCount: 15,
    currentCount: 0,
    rewardFeathers: 35,
    rewardXP: 100,
    completed: false,
    claimed: false,
    type: 'SCORE_SINGLE'
  },
  {
    id: 'quest_collect_feathers',
    title: 'Starlight Harvester',
    description: 'Collect 10 Star Feathers across all flights today.',
    targetCount: 10,
    currentCount: 0,
    rewardFeathers: 45,
    rewardXP: 120,
    completed: false,
    claimed: false,
    type: 'COLLECT_FEATHERS'
  },
  {
    id: 'quest_play_games',
    title: 'Persistent Pilot',
    description: 'Complete 3 flight attempts.',
    targetCount: 3,
    currentCount: 0,
    rewardFeathers: 25,
    rewardXP: 80,
    completed: false,
    claimed: false,
    type: 'PLAY_GAMES'
  },
  {
    id: 'quest_cyber_run',
    title: 'Neon Drift',
    description: 'Score 10+ points with Cyber Laser obstacles equipped.',
    targetCount: 10,
    currentCount: 0,
    rewardFeathers: 50,
    rewardXP: 150,
    completed: false,
    claimed: false,
    type: 'THEMED_RUN',
    themeReq: 'CYBER_LASER'
  }
];

export const INITIAL_SEASON: SeasonalEvent = {
  seasonNumber: 1,
  name: 'Neon Skies Championship',
  description: 'Compete in the premier aerial circuit. Earn season XP to unlock the Celestial Saucer skin!',
  endsInDays: 14,
  currentTier: 3,
  maxTier: 10,
  tierXP: 340,
  tierMaxXP: 500,
  exclusiveSkinId: 'cosmic_ufo'
};

export const INITIAL_WEEKLY_MISSIONS: WeeklyMission[] = [
  {
    id: 'weekly_centurion',
    title: 'Centurion Aviator',
    subtitle: 'Endurance & Obstacle Mastery',
    description: 'Clear 150 aerial barriers across all flight sorties this week.',
    targetCount: 150,
    currentCount: 0,
    rewardFeathers: 350,
    rewardXP: 600,
    completed: false,
    claimed: false,
    type: 'CUMULATIVE_PIPES',
    difficulty: 'Hard',
    rewardBadge: {
      id: 'badge_legendary_centurion',
      name: 'Centurion Golden Wing',
      tagline: 'Master of Aerial Endurance',
      description: 'Prestigious golden aviator insignia awarded for conquering 150+ aerial hazards in a single operational week.',
      tier: 'Legendary',
      icon: '⚜️',
      glowColor: '#F59E0B',
      accentBorder: 'border-amber-400',
      unlocked: false,
      prestigePoints: 250
    }
  },
  {
    id: 'weekly_starlight_tycoon',
    title: 'Celestial Starlight Tycoon',
    subtitle: 'Astronomical Feather Reserves',
    description: 'Harvest 75 glowing Star Feathers directly from the airspace.',
    targetCount: 75,
    currentCount: 0,
    rewardFeathers: 450,
    rewardXP: 800,
    completed: false,
    claimed: false,
    type: 'COLLECT_FEATHERS',
    difficulty: 'Extreme',
    rewardBadge: {
      id: 'badge_legendary_tycoon',
      name: 'Solar Apex Crown',
      tagline: 'Harvester of the Heavens',
      description: 'Crown of shimmering solar plasma bestowed on pilots who accumulated 75+ Star Feathers in weekly sorties.',
      tier: 'Legendary',
      icon: '👑',
      glowColor: '#FBBF24',
      accentBorder: 'border-yellow-400',
      unlocked: false,
      prestigePoints: 350
    }
  },
  {
    id: 'weekly_apex_ace',
    title: 'Stratosphere Ace',
    subtitle: 'Single-Sortie Record Run',
    description: 'Reach a flight record score of 35 or higher in a single continuous sortie.',
    targetCount: 35,
    currentCount: 0,
    rewardFeathers: 600,
    rewardXP: 1000,
    completed: false,
    claimed: false,
    type: 'HIGH_SCORE_SINGLE',
    difficulty: 'Master',
    rewardBadge: {
      id: 'badge_legendary_apex',
      name: 'Aegis of the Stratosphere',
      tagline: 'Peak Reflex Supremacy',
      description: 'The highest flight honor in AeroFlap history, validating transcendent aerial reflexes (35+ continuous score).',
      tier: 'Legendary',
      icon: '🦅',
      glowColor: '#38BDF8',
      accentBorder: 'border-sky-400',
      unlocked: false,
      prestigePoints: 500
    }
  },
  {
    id: 'weekly_cyber_overlord',
    title: 'Cyber Overdrive',
    subtitle: 'Neon Laser Gauntlet',
    description: 'Successfully bypass 60 Cyber Laser obstacles under high photon frequencies.',
    targetCount: 60,
    currentCount: 0,
    rewardFeathers: 400,
    rewardXP: 700,
    completed: false,
    claimed: false,
    type: 'THEMED_PIPES',
    themeReq: 'CYBER_LASER',
    difficulty: 'Extreme',
    rewardBadge: {
      id: 'badge_legendary_cyber',
      name: 'Quantum Singularity',
      tagline: 'Cybernetic Architect',
      description: 'Forged in high-energy photon streams, signifying supreme navigation through cyber grid lasers.',
      tier: 'Legendary',
      icon: '⚡',
      glowColor: '#A855F7',
      accentBorder: 'border-purple-400',
      unlocked: false,
      prestigePoints: 300
    }
  },
  {
    id: 'weekly_ironclad_vanguard',
    title: 'Ironclad Vanguard',
    subtitle: 'Tenacious Sortie Discipline',
    description: 'Launch and complete 25 distinct flight sorties to maintain airspace dominance.',
    targetCount: 25,
    currentCount: 0,
    rewardFeathers: 300,
    rewardXP: 500,
    completed: false,
    claimed: false,
    type: 'TOTAL_GAMES',
    difficulty: 'Hard',
    rewardBadge: {
      id: 'badge_legendary_vanguard',
      name: 'Titanium Vanguard Crest',
      tagline: 'Unshakable Dedication',
      description: 'Insignia of relentless commitment, awarded for executing 25 tactical sorties in one week.',
      tier: 'Legendary',
      icon: '🛡️',
      glowColor: '#10B981',
      accentBorder: 'border-emerald-400',
      unlocked: false,
      prestigePoints: 200
    }
  }
];

export const ALL_LEGENDARY_BADGES: LegendaryBadge[] = INITIAL_WEEKLY_MISSIONS.map(
  (m) => m.rewardBadge
);

