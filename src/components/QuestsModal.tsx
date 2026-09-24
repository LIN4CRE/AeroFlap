import React from 'react';
import { Target, Zap, Gift, Check, Clock, Feather, X } from 'lucide-react';
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

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  season,
  profile,
  onClaimQuest,
  onClaimStreak,
  onClose
}) => {
  const canClaimDailyStreak = !profile.lastStreakClaimDate ||
    new Date(profile.lastStreakClaimDate).toDateString() !== new Date().toDateString();

  const handleClaim = (quest: DailyQuest) => {
    soundFx.playFanfare();
    onClaimQuest(quest.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <span>Flight Operations & Quests</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Daily Flight Objectives</span>
              <span aria-hidden="true">·</span>
              <span>Season 1 Championship</span>
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
          {/* Daily Streak Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">Daily Flight Streak</span>
                  <span className="text-[11px] font-mono-nums font-semibold text-amber-400">
                    Day {profile.streakDays}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check in daily to earn escalating feather rewards and XP boosts.
                </p>
              </div>
            </div>

            <button
              disabled={!canClaimDailyStreak}
              onClick={onClaimStreak}
              className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                canClaimDailyStreak
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {canClaimDailyStreak ? 'Claim 50 🪶' : 'Claimed'}
            </button>
          </div>

          {/* Seasonal Event Banner */}
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

          {/* Daily Quests List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Daily Flight Directives
              </span>
              <span className="text-[11px] text-slate-500">Resets every 24h</span>
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
                        <span className="font-semibold text-sm text-slate-100 truncate">
                          {q.title}
                        </span>
                        {q.claimed && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>

                      {/* Mini progress bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-mono-nums text-[11px] text-slate-400 shrink-0">
                          {q.currentCount}/{q.targetCount}
                        </span>
                      </div>
                    </div>

                    {/* Reward & Claim */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-mono-nums font-semibold">
                        <Feather className="w-3.5 h-3.5" />
                        <span>+{q.rewardFeathers}</span>
                      </div>

                      {q.claimed ? (
                        <span className="p-1.5 bg-slate-800 text-slate-500 rounded-lg">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : q.completed ? (
                        <button
                          onClick={() => handleClaim(q)}
                          className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-1"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Claim</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 py-1 px-2 bg-slate-800/60 rounded-lg">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
