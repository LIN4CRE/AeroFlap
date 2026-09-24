import React from 'react';
import {
  Target,
  Zap,
  Gift,
  Check,
  Clock,
  Feather,
  X,
  Flame,
  Calendar,
  Lock,
  Sparkles,
  Trophy,
  Award
} from 'lucide-react';
import { DailyQuest, SeasonalEvent, PlayerProfile } from '../types/game';
import { soundFx } from '../utils/audio';

interface QuestsModalProps {
  quests: DailyQuest[];
  season: SeasonalEvent;
  profile: PlayerProfile;
  onClaimQuest: (questId: string) => void;
  onClaimStreak: () => void;
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
  season,
  profile,
  onClaimQuest,
  onClaimStreak,
  onClose
}) => {
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
  const progressPct = Math.min(100, Math.round((cycleDay / 7) * 100));

  const handleClaim = (quest: DailyQuest) => {
    soundFx.playFanfare();
    onClaimQuest(quest.id);
  };

  const handleStreakClaim = () => {
    soundFx.playFanfare();
    onClaimStreak();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <span>Flight Operations & Daily Streaks</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Daily Flight Objectives</span>
              <span aria-hidden="true">·</span>
              <span>7-Day Login Streak Matrix & Quests</span>
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

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* SECTION: 7-Day Login Streak Calendar & Progress Component */}
          <div className="bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
            {/* Top Atmospheric Glow */}
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
                  Day {cycleDay} of 7 ({progressPct}%)
                </span>
              </div>

              <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              {/* Milestone Ticks */}
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
                  const isUpcoming = item.day > cycleDay;

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
                      {/* Major Bonus Ribbon */}
                      {item.isMajorBonus && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[9px] font-bold text-slate-950 whitespace-nowrap shadow-sm">
                          {item.day === 7 ? 'MEGA BONUS' : 'BONUS'}
                        </div>
                      )}

                      {/* Day Label */}
                      <span className={`text-[11px] font-bold mt-1 ${isCurrent ? 'text-amber-300' : 'text-slate-400'}`}>
                        Day {item.day}
                      </span>

                      {/* Reward Graphic */}
                      <div className="my-1.5 flex flex-col items-center">
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-xs font-mono-nums font-bold mt-0.5 ${
                          item.day === 7 ? 'text-amber-300 font-extrabold' : isCurrent ? 'text-white' : 'text-slate-300'
                        }`}>
                          +{item.rewardFeathers}
                        </span>
                      </div>

                      {/* Status Indicator */}
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

            {/* Season Tier Bar */}
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

                      {/* Quest Progress bar */}
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
                        onClick={() => handleClaim(q)}
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
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Daily check-in resets every 24 hours</span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
