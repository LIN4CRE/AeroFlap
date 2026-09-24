import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Globe,
  X,
  Medal,
  ShieldCheck,
  Flame,
  User,
  Zap,
  Gift,
  Check,
  Clock,
  Sparkles,
  Radio,
  ChevronRight,
  Shield
} from 'lucide-react';
import { LeaderboardEntry, PlayerProfile, CommunityChallenge } from '../types/game';
import { ALL_LEGENDARY_BADGES } from '../data/quests';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  profile: PlayerProfile;
  communityChallenge: CommunityChallenge;
  onClaimMilestone?: (milestoneIndex: number) => void;
  onClaimCommunityReward?: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardProps> = ({
  entries,
  profile,
  communityChallenge,
  onClaimMilestone,
  onClaimCommunityReward,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'challenge' | 'friends' | 'stats'>('global');

  const filteredEntries = activeTab === 'friends'
    ? entries.filter((e) => e.isFriend || e.isCurrentUser || e.username === profile.username)
    : entries;

  const challengePct = Math.min(
    100,
    Math.round((communityChallenge.currentPipes / communityChallenge.targetPipes) * 1000) / 10
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Hall of Aces & Leaderboards</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Real-Time Telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Global Community & Social Circuit</span>
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

        {/* Tab Filters */}
        <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'global'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Circuit</span>
            </button>

            <button
              onClick={() => setActiveTab('challenge')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === 'challenge'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Community Challenge</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] font-mono-nums font-bold rounded-full border border-amber-400/30">
                {challengePct}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'friends'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends & Social</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Pilot Career</span>
            </button>
          </div>
        </div>

        {/* Global Tab Mini-Challenge Banner */}
        {activeTab === 'global' && (
          <div
            onClick={() => setActiveTab('challenge')}
            className="mb-2 p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-800/40 border border-purple-500/30 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Global Community Challenge: {communityChallenge.name}
                  </span>
                  <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {challengePct}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate mt-0.5">
                  Pilots have cleared <span className="font-mono-nums font-semibold text-white">{communityChallenge.currentPipes.toLocaleString()}</span> / {communityChallenge.targetPipes.toLocaleString()} collective obstacles
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-300 font-semibold shrink-0 ml-2">
              <span>View Challenge</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Tab Content: Global / Friends List */}
        {(activeTab === 'global' || activeTab === 'friends') && (
          <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
            {filteredEntries.map((item) => {
              const isMe = item.isCurrentUser || item.username === profile.username;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isMe
                      ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/20'
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {item.rank === 1 ? (
                        <Medal className="w-6 h-6 text-amber-400 drop-shadow-md" />
                      ) : item.rank === 2 ? (
                        <Medal className="w-6 h-6 text-slate-300 drop-shadow-md" />
                      ) : item.rank === 3 ? (
                        <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />
                      ) : (
                        <span className="font-mono-nums font-bold text-sm text-slate-400">
                          #{item.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar Icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-slate-700/60">
                      {item.avatarSkin === 'golden_monarch' && '👑'}
                      {item.avatarSkin === 'phoenix_flame' && '🔥'}
                      {item.avatarSkin === 'pixel_arcade' && '👾'}
                      {item.avatarSkin === 'void_raven' && '🔮'}
                      {item.avatarSkin === 'cyber_drone' && '🤖'}
                      {item.avatarSkin === 'classic_canary' && '🐤'}
                      {item.avatarSkin === 'steampunk_aviator' && '🦉'}
                      {item.avatarSkin === 'kawaii_chick' && '🐥'}
                      {item.avatarSkin === 'cosmic_ufo' && '🛸'}
                      {item.avatarSkin === 'ethereal_ghost' && '👻'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold text-sm truncate ${isMe ? 'text-sky-300' : 'text-slate-200'}`}>
                          {item.username}
                        </span>
                        {isMe && (
                          <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                        {isMe && profile.equippedBadgeId && (
                          (() => {
                            const badge = ALL_LEGENDARY_BADGES.find((b) => b.id === profile.equippedBadgeId);
                            return badge ? (
                              <span
                                className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-1"
                                title={`Legendary Badge: ${badge.name}`}
                              >
                                <span>{badge.icon}</span>
                                <span className="hidden sm:inline">{badge.name}</span>
                              </span>
                            ) : null;
                          })()
                        )}
                        {item.isFriend && !isMe && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.2 rounded">
                            FRIEND
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.obstacleTheme.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <span className="font-mono-nums font-bold text-xl text-white block">
                      {item.score}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 block">
                      pipes cleared
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content: Dedicated Global Community Challenge Tab */}
        {activeTab === 'challenge' && (
          <div className="flex-1 overflow-y-auto py-2 space-y-4 pr-1">
            {/* Mission Directive Banner */}
            <div className="bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-500/40 rounded-2xl p-4.5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Live Server Event Active
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-300 font-medium bg-purple-900/40 px-2 py-0.5 rounded-lg border border-purple-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ends in {communityChallenge.endsInDays} days</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-display text-white">{communityChallenge.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {communityChallenge.operationCode}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {communityChallenge.description}
                </p>
              </div>

              {/* Server Collective Telemetry Counter */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Collective Server Pipes Navigated</span>
                  <span className="font-mono-nums font-bold text-white text-sm">
                    {communityChallenge.currentPipes.toLocaleString()} / {communityChallenge.targetPipes.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${challengePct}%` }}
                  >
                    <div className="absolute inset-0 bg-white/15 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>1,428 pilots contributing live</span>
                  </div>
                  <span className="font-mono font-bold text-purple-300 text-xs">
                    {challengePct}% Completed
                  </span>
                </div>
              </div>

              {/* Your Personal Contribution Callout */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-900/20 border border-purple-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-slate-200">
                    Your Personal Flight Contribution:
                  </span>
                </div>
                <span className="font-mono-nums font-bold text-sm text-amber-300">
                  +{communityChallenge.playerContribution} pipes cleared
                </span>
              </div>
            </div>

            {/* Community-Wide Reward Showcase */}
            <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Community-Wide Reward
                    </span>
                    {communityChallenge.completed && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        GOAL REACHED!
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-0.5">
                    {communityChallenge.rewardTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {communityChallenge.rewardDescription}
                  </p>
                </div>
              </div>

              <button
                disabled={!communityChallenge.completed || communityChallenge.communityRewardClaimed}
                onClick={onClaimCommunityReward}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  communityChallenge.completed && !communityChallenge.communityRewardClaimed
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95'
                    : communityChallenge.communityRewardClaimed
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                {communityChallenge.communityRewardClaimed
                  ? 'Reward Claimed ✓'
                  : communityChallenge.completed
                  ? 'Claim Grand Prize! 🎁'
                  : `${(communityChallenge.targetPipes - communityChallenge.currentPipes).toLocaleString()} Pipes Remaining`}
              </button>
            </div>

            {/* Stage Milestones List */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Community Operations Milestones
                </span>
                <span className="text-[11px] text-slate-500">Every cleared pipe counts</span>
              </div>

              <div className="space-y-2">
                {communityChallenge.milestones.map((m, idx) => {
                  const isReached = communityChallenge.currentPipes >= m.threshold;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        m.claimed
                          ? 'bg-slate-800/30 border-slate-800'
                          : isReached
                          ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'bg-slate-800/40 border-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            m.claimed
                              ? 'bg-slate-800 text-slate-500 border-slate-700'
                              : isReached
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-slate-800/60 text-slate-500 border-slate-800'
                          }`}
                        >
                          {m.claimed ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : isReached ? (
                            <Sparkles className="w-5 h-5 text-amber-300" />
                          ) : (
                            <span className="font-mono-nums text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-100 truncate">
                              {m.label}
                            </span>
                            {isReached && !m.claimed && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-semibold rounded">
                                UNLOCKED
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            Target: {m.threshold.toLocaleString()} collective pipes · Reward: +{m.rewardFeathers} Star Feathers
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={!isReached || m.claimed}
                        onClick={() => onClaimMilestone && onClaimMilestone(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                          m.claimed
                            ? 'bg-slate-800 text-slate-500 cursor-default'
                            : isReached
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {m.claimed ? 'Claimed' : isReached ? `Claim +${m.rewardFeathers} 🪶` : 'Locked'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Pilot Career Stats Tab */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Personal Best</span>
                <span className="font-mono-nums font-bold text-3xl text-white">
                  {profile.highScore}
                </span>
                <span className="text-[11px] text-sky-400 block mt-1">High Record</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Total Flights</span>
                <span className="font-mono-nums font-bold text-3xl text-white">
                  {profile.totalGames}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Flight Sessions</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Total Cleared</span>
                <span className="font-mono-nums font-bold text-3xl text-white">
                  {profile.totalPipesPassed}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-1">Pipes Navigated</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Star Feathers</span>
                <span className="font-mono-nums font-bold text-3xl text-amber-400">
                  {profile.starFeathers}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Available to Spend</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Pilot Level</span>
                <span className="font-mono-nums font-bold text-3xl text-pink-400">
                  {profile.level}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">XP: {profile.xp}</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Daily Streak</span>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-mono-nums font-bold text-3xl text-white">
                    {profile.streakDays}
                  </span>
                </div>
                <span className="text-[11px] text-orange-400 block mt-1">Days Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Service Status */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Synced with Global Leaderboard & Server Event Circuit</span>
          </div>
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
