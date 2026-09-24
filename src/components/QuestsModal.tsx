import React, { useState } from 'react';
import {
  Target,
  Zap,
  Check,
  Clock,
  Feather,
  X,
  Flame,
  Calendar,
  Lock,
  Sparkles,
  Trophy,
  Award,
  Shield,
  Crown,
  ChevronRight,
  Info,
  Star
} from 'lucide-react';
import { DailyQuest, SeasonalEvent, PlayerProfile, WeeklyMission, LegendaryBadge } from '../types/game';
import { ALL_LEGENDARY_BADGES } from '../data/quests';
import { soundFx } from '../utils/audio';

interface QuestsModalProps {
  quests: DailyQuest[];
  weeklyMissions: WeeklyMission[];
  season: SeasonalEvent;
  profile: PlayerProfile;
  onClaimQuest: (questId: string) => void;
  onClaimWeeklyMission: (missionId: string) => void;
  onClaimStreak: () => void;
  onEquipBadge?: (badgeId: string) => void;
  onClose: () => void;
}

interface CalendarDayReward {
  day: number;
  rewardFeathers: number;
  label: string;
  isMajorBonus: boolean;
  bonusTitle?: string;
  icon: string;
}

const STREAK_CYCLE_REWARDS: CalendarDayReward[] = [
  { day: 1, rewardFeathers: 50, label: 'Daily Starlight', isMajorBonus: false, icon: '🪶' },
  { day: 2, rewardFeathers: 75, label: 'Wing Polish', isMajorBonus: false, icon: '🪶' },
  { day: 3, rewardFeathers: 120, label: 'Ace Bonus', isMajorBonus: true, bonusTitle: 'Tier 1 Ace Bonus', icon: '🎖️' },
  { day: 4, rewardFeathers: 150, label: 'Cloud Glider', isMajorBonus: false, icon: '🪶' },
  { day: 5, rewardFeathers: 200, label: 'Thermal Boost', isMajorBonus: false, icon: '🪶' },
  { day: 6, rewardFeathers: 250, label: 'Stratosphere Pilot', isMajorBonus: false, icon: '🪶' },
  { day: 7, rewardFeathers: 500, label: 'Grand Apex Pack', isMajorBonus: true, bonusTitle: 'MEGA WEEKLY BONUS', icon: '👑' },
];

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  weeklyMissions,
  season,
  profile,
  onClaimQuest,
  onClaimWeeklyMission,
  onClaimStreak,
  onEquipBadge,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'badges'>('daily');
  const [selectedBadge, setSelectedBadge] = useState<LegendaryBadge | null>(null);

  const canClaimDailyStreak =
    !profile.lastStreakClaimDate ||
    new Date(profile.lastStreakClaimDate).toDateString() !== new Date().toDateString();

  // Streak position in the 7-day cyclical calendar
  const currentStreak = Math.max(1, profile.streakDays);
  const cycleDay = ((currentStreak - 1) % 7) + 1; // 1 to 7

  // Calculate days until next milestone bonus
  let daysUntilNextBonus = 0;
  let nextBonusLabel = '';
  let nextBonusFeathers = 0;

  if (cycleDay < 3) {
    daysUntilNextBonus = 3 - cycleDay;
    nextBonusLabel = 'Day 3 Ace Milestone';
    nextBonusFeathers = 120;
  } else if (cycleDay === 3) {
    daysUntilNextBonus = 0;
    nextBonusLabel = 'Day 3 Ace Milestone (Today!)';
    nextBonusFeathers = 120;
  } else if (cycleDay < 7) {
    daysUntilNextBonus = 7 - cycleDay;
    nextBonusLabel = 'Day 7 Grand Apex Bonus';
    nextBonusFeathers = 500;
  } else {
    daysUntilNextBonus = 0;
    nextBonusLabel = 'Day 7 Grand Apex Bonus (Today!)';
    nextBonusFeathers = 500;
  }

  const todayReward = STREAK_CYCLE_REWARDS[cycleDay - 1];
  const streakProgressPct = Math.min(100, Math.round((cycleDay / 7) * 100));

  // Claim counts for badge indicators
  const claimableDailyCount =
    quests.filter((q) => q.completed && !q.claimed).length + (canClaimDailyStreak ? 1 : 0);
  const claimableWeeklyCount = weeklyMissions.filter((m) => m.completed && !m.claimed).length;

  const unlockedBadgeIds = profile.unlockedBadges || [];
  const completedWeeklyCount = weeklyMissions.filter((m) => m.completed).length;

  const handleClaimDaily = (quest: DailyQuest) => {
    soundFx.playFanfare();
    onClaimQuest(quest.id);
  };

  const handleClaimWeekly = (mission: WeeklyMission) => {
    soundFx.playFanfare();
    onClaimWeeklyMission(mission.id);
  };

  const handleStreakClaim = () => {
    soundFx.playFanfare();
    onClaimStreak();
  };

  const handleEquipBadge = (badgeId: string) => {
    soundFx.playClick();
    if (onEquipBadge) {
      onEquipBadge(badgeId);
    }
  };

  const getDifficultyBadge = (difficulty: WeeklyMission['difficulty']) => {
    switch (difficulty) {
      case 'Master':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'Extreme':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      case 'Hard':
      default:
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <span>Operations & Missions</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Daily Flight Directives</span>
              <span aria-hidden="true">·</span>
              <span>Weekly Legendary Missions</span>
              <span aria-hidden="true">·</span>
              <span>Trophy Hall</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar (Zero-pill, high-legibility) */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeTab === 'daily' ? 'text-sky-400' : ''}`} />
            <span>Daily & Streaks</span>
            {claimableDailyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                {claimableDailyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-amber-950/60 to-slate-800 text-amber-300 shadow-sm border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${activeTab === 'weekly' ? 'text-amber-400' : ''}`} />
            <span>Weekly Missions</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              LEGENDARY
            </span>
            {claimableWeeklyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                {claimableWeeklyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${activeTab === 'badges' ? 'text-amber-400' : ''}`} />
            <span>Badges Vault</span>
            <span className="text-[10px] font-mono-nums text-slate-400">
              {unlockedBadgeIds.length}/{ALL_LEGENDARY_BADGES.length}
            </span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* TAB 1: DAILY DIRECTIVES & 7-DAY STREAK */}
          {activeTab === 'daily' && (
            <>
              {/* SECTION: 7-Day Login Streak Calendar & Progress Component */}
              <div className="bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

                {/* Streak Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 text-white shrink-0">
                      <Flame className="w-6 h-6 fill-current text-white animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base font-display text-white">
                          Daily Flight Streak
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Day {currentStreak} Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Check in every 24 hours to keep your streak alive and unlock escalating bonus rewards.
                      </p>
                    </div>
                  </div>

                  {/* Check-In / Claim Button */}
                  <button
                    disabled={!canClaimDailyStreak}
                    onClick={handleStreakClaim}
                    className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-2 ${
                      canClaimDailyStreak
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60 cursor-default'
                    }`}
                  >
                    {canClaimDailyStreak ? (
                      <>
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span>Check In & Claim +{todayReward.rewardFeathers} 🪶</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Checked In for Today ✓</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Countdown Banner until Next Bonus Reward */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-medium">Bonus Milestone Telemetry:</span>
                  </div>
                  <div className="font-semibold text-right">
                    {daysUntilNextBonus === 0 ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{nextBonusLabel} is Ready to Claim Today! (+{nextBonusFeathers} 🪶)</span>
                      </span>
                    ) : (
                      <span className="text-sky-300">
                        <span className="font-bold text-white">{daysUntilNextBonus}</span> {daysUntilNextBonus === 1 ? 'day' : 'days'} until next Major Bonus Reward ({nextBonusLabel}: +{nextBonusFeathers} 🪶)
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Progress Bar to Next Bonus */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">
                      7-Day Streak Cycle Progress
                    </span>
                    <span className="font-mono-nums font-semibold text-amber-400">
                      Day {cycleDay} of 7 ({streakProgressPct}%)
                    </span>
                  </div>

                  <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500 relative"
                      style={{ width: `${streakProgressPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-0.5">
                    <span>Start</span>
                    <span className={cycleDay >= 3 ? 'text-amber-400 font-semibold' : ''}>Day 3: Ace Pin 🎖️</span>
                    <span className={cycleDay >= 7 ? 'text-amber-400 font-semibold' : ''}>Day 7: Apex Crown 👑</span>
                  </div>
                </div>

                {/* 7-DAY VISUAL CALENDAR COMPONENT */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Weekly Flight Check-In Matrix
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {canClaimDailyStreak ? 'Today: Pending Check-In' : 'Today: Checked In ✓'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {STREAK_CYCLE_REWARDS.map((item) => {
                      const isPast = item.day < cycleDay || (item.day === cycleDay && !canClaimDailyStreak);
                      const isCurrent = item.day === cycleDay;

                      return (
                        <div
                          key={item.day}
                          className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between border transition-all text-center min-h-[105px] ${
                            isCurrent
                              ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                              : isPast
                              ? 'bg-slate-800/40 border-emerald-500/40'
                              : 'bg-slate-800/30 border-slate-800/80 opacity-70'
                          } ${item.isMajorBonus ? 'col-span-1' : ''}`}
                        >
                          {item.isMajorBonus && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[9px] font-bold text-slate-950 whitespace-nowrap shadow-sm">
                              {item.day === 7 ? 'MEGA BONUS' : 'BONUS'}
                            </div>
                          )}

                          <span className={`text-[11px] font-bold mt-1 ${isCurrent ? 'text-amber-300' : 'text-slate-400'}`}>
                            Day {item.day}
                          </span>

                          <div className="my-1.5 flex flex-col items-center">
                            <span className="text-xl">{item.icon}</span>
                            <span className={`text-xs font-mono-nums font-bold mt-0.5 ${
                              item.day === 7 ? 'text-amber-300 font-extrabold' : isCurrent ? 'text-white' : 'text-slate-300'
                            }`}>
                              +{item.rewardFeathers}
                            </span>
                          </div>

                          <div className="w-full">
                            {isPast ? (
                              <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 py-0.5 rounded-lg border border-emerald-500/20">
                                <Check className="w-3 h-3" />
                                <span>Claimed</span>
                              </div>
                            ) : isCurrent ? (
                              <div className={`flex items-center justify-center gap-1 text-[10px] font-bold py-0.5 rounded-lg ${
                                canClaimDailyStreak
                                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {canClaimDailyStreak ? 'CLAIM NOW' : 'CLAIMED ✓'}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 py-0.5">
                                <Lock className="w-3 h-3" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Seasonal Event Championship Banner */}
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-sm text-white">{season.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ends in {season.endsInDays}d</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-1">{season.description}</p>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Tier {season.currentTier} of {season.maxTier}</span>
                    <span className="font-mono-nums text-slate-400">{season.tierXP} / {season.tierMaxXP} Season XP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${(season.tierXP / season.tierMaxXP) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Daily Quests Directives List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Daily Flight Directives
                  </span>
                  <span className="text-[11px] text-slate-500">Resets daily at 00:00 UTC</span>
                </div>

                <div className="space-y-2.5">
                  {quests.map((q) => {
                    const progressPct = Math.min(100, Math.round((q.currentCount / q.targetCount) * 100));

                    return (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-100 truncate">{q.title}</span>
                            {q.completed && !q.claimed && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.2 rounded">
                                READY
                              </span>
                            )}
                            {q.claimed && (
                              <span className="text-[10px] bg-slate-700/60 text-slate-400 font-medium px-1.5 py-0.2 rounded">
                                CLAIMED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  q.completed ? 'bg-emerald-500' : 'bg-sky-500'
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono-nums text-slate-400 shrink-0">
                              {q.currentCount}/{q.targetCount}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1 text-xs font-semibold text-amber-400 mb-1">
                            <Feather className="w-3.5 h-3.5" />
                            <span>+{q.rewardFeathers}</span>
                          </div>
                          <button
                            disabled={!q.completed || q.claimed}
                            onClick={() => handleClaimDaily(q)}
                            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                              q.claimed
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : q.completed
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {q.claimed ? 'Claimed' : q.completed ? 'Claim' : 'In Flight'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: WEEKLY MISSIONS (Harder, long-term goals with Legendary tier badges) */}
          {activeTab === 'weekly' && (
            <div className="space-y-6">
              {/* Weekly Hero Atmosphere Banner */}
              <div className="relative rounded-3xl p-5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
                      <Crown className="w-7 h-7 fill-current text-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold font-display text-white">
                          Weekly Legendary Directives
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                          TIER: LEGENDARY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                        Challenging, multi-flight endurance operations designed for dedicated pilots. Conquer these missions to claim exclusive Legendary Badges and massive Star Feather caches.
                      </p>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="shrink-0 p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30 text-right">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold justify-end">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Resets Every Monday</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Cycle Ends in <span className="text-white font-bold font-mono">4d 18h</span>
                    </div>
                  </div>
                </div>

                {/* Cumulative Weekly Progress Bar */}
                <div className="mt-4 pt-3 border-t border-amber-500/20">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Weekly Legendary Completion</span>
                    </span>
                    <span className="font-mono-nums font-bold text-amber-300">
                      {completedWeeklyCount} of {weeklyMissions.length} Conquered
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 relative"
                      style={{ width: `${(completedWeeklyCount / Math.max(1, weeklyMissions.length)) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Missions Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Active Weekly Objectives & Legendary Badge Rewards</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tap any badge to inspect lore
                  </span>
                </div>

                {weeklyMissions.map((mission) => {
                  const progressPct = Math.min(
                    100,
                    Math.round((mission.currentCount / mission.targetCount) * 100)
                  );
                  const isClaimable = mission.completed && !mission.claimed;
                  const isBadgeUnlocked = unlockedBadgeIds.includes(mission.rewardBadge.id);

                  return (
                    <div
                      key={mission.id}
                      className={`p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col gap-4 ${
                        mission.claimed
                          ? 'bg-slate-900/60 border-emerald-500/30'
                          : isClaimable
                          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/50'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Row: Title, Subtitle, Difficulty Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(mission.difficulty)}`}>
                            {mission.difficulty.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-white font-display">
                            {mission.title}
                          </h4>
                          <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {mission.subtitle}
                          </span>
                        </div>

                        {/* Status chip */}
                        {mission.claimed ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed · Badge Unlocked</span>
                          </div>
                        ) : isClaimable ? (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400 animate-pulse shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>READY TO CLAIM!</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 font-mono font-medium shrink-0">
                            {mission.currentCount} / {mission.targetCount}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {mission.description}
                      </p>

                      {/* Mission Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Tactical Progress</span>
                          <span className="font-mono-nums font-semibold text-slate-200">
                            {mission.currentCount} / {mission.targetCount} ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              mission.completed
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Rewards & Claim Section */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Interactive Legendary Badge Showcase */}
                        <div
                          onClick={() => setSelectedBadge(mission.rewardBadge)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                            {mission.rewardBadge.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                                {mission.rewardBadge.name}
                              </span>
                              <span className="text-[9px] font-black tracking-wider px-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                LEGENDARY
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>+{mission.rewardBadge.prestigePoints} Prestige</span>
                              <span>·</span>
                              <span className="text-amber-400/80 group-hover:underline">Inspect Lore</span>
                            </div>
                          </div>
                        </div>

                        {/* Feathers, XP and Action Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 font-bold text-amber-400">
                              <Feather className="w-3.5 h-3.5" />
                              <span>+{mission.rewardFeathers}</span>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-sky-400">
                              <Zap className="w-3.5 h-3.5" />
                              <span>+{mission.rewardXP} XP</span>
                            </div>
                          </div>

                          <button
                            disabled={!mission.completed || mission.claimed}
                            onClick={() => handleClaimWeekly(mission)}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                              mission.claimed
                                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-default'
                                : isClaimable
                                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                            }`}
                          >
                            {mission.claimed ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Unlocked</span>
                              </>
                            ) : isClaimable ? (
                              <>
                                <Trophy className="w-4 h-4 fill-current" />
                                <span>CLAIM BADGE</span>
                              </>
                            ) : (
                              <span>In Flight</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LEGENDARY BADGES TROPHY HALL & VAULT */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              {/* Badges Vault Header Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-950 border border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 shrink-0">
                    <Shield className="w-6 h-6 fill-current text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold font-display text-white">
                      Legendary Badge Trophy Hall
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Exclusive badges earned by finishing Weekly Missions. Equip your favorite badge to display it alongside your pilot callsign.
                    </p>
                  </div>
                </div>

                {/* Prestige Summary */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Pilot Prestige Rating</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {ALL_LEGENDARY_BADGES.reduce(
                      (acc, b) => (unlockedBadgeIds.includes(b.id) ? acc + b.prestigePoints : acc),
                      0
                    )}{' '}
                    Points
                  </div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ALL_LEGENDARY_BADGES.map((badge) => {
                  const isUnlocked = unlockedBadgeIds.includes(badge.id);
                  const isEquipped = profile.equippedBadgeId === badge.id;

                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer group ${
                        isEquipped
                          ? 'bg-amber-950/30 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                          : isUnlocked
                          ? 'bg-slate-850/80 border-amber-500/30 hover:border-amber-400/80 hover:bg-slate-800'
                          : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                            isUnlocked
                              ? 'bg-gradient-to-tr from-amber-500/25 to-yellow-500/10 border border-amber-400/40 group-hover:scale-105 transition-transform'
                              : 'bg-slate-950 border border-slate-800 grayscale'
                          }`}
                        >
                          {badge.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-white truncate">
                              {badge.name}
                            </span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                              LEGENDARY
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                            {badge.tagline}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">
                          +{badge.prestigePoints} Prestige
                        </span>

                        {isUnlocked ? (
                          isEquipped ? (
                            <span className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                              <Sparkles className="w-3.5 h-3.5 fill-current" />
                              <span>Equipped as Title</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEquipBadge(badge.id);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-colors"
                            >
                              Equip on Profile
                            </button>
                          )
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <Lock className="w-3 h-3" />
                            <span>Weekly Mission Reward</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Weekly missions reset every Monday at 00:00 UTC</span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* BADGE INSPECTOR OVERLAY DIALOG */}
      {selectedBadge && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Graphic */}
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-500/20 to-orange-500/30 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20 animate-pulse">
                {selectedBadge.icon}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-amber-400 text-slate-950">
                  LEGENDARY TIER
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{selectedBadge.prestigePoints} Prestige
                </span>
              </div>

              <h3 className="text-lg font-extrabold font-display text-white mt-2">
                {selectedBadge.name}
              </h3>
              <p className="text-xs font-medium text-amber-300/90 mt-0.5">
                {selectedBadge.tagline}
              </p>
            </div>

            {/* Lore & Details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                Commendation Lore:
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedBadge.description}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Unlock Status:</span>
                {unlockedBadgeIds.includes(selectedBadge.id) ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Unlocked & Verified</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Earn in Weekly Missions</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              {unlockedBadgeIds.includes(selectedBadge.id) && (
                <button
                  onClick={() => {
                    handleEquipBadge(selectedBadge.id);
                    setSelectedBadge(null);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    profile.equippedBadgeId === selectedBadge.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {profile.equippedBadgeId === selectedBadge.id
                      ? 'Currently Equipped ✓'
                      : 'Equip as Profile Badge'}
                  </span>
                </button>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
