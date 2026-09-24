import { DailyQuest, SeasonalEvent } from '../types/game';

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
