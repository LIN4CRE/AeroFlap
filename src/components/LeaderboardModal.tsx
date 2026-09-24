import React, { useState } from 'react';
import { Trophy, Users, Globe, X, Medal, ShieldCheck, Flame, User } from 'lucide-react';
import { LeaderboardEntry, PlayerProfile } from '../types/game';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  profile: PlayerProfile;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardProps> = ({
  entries,
  profile,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'stats'>('global');

  const filteredEntries = activeTab === 'friends'
    ? entries.filter((e) => e.isFriend || e.isCurrentUser || e.username === profile.username)
    : entries;

  const userRankEntry = entries.find((e) => e.isCurrentUser || e.username === profile.username);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Hall of Aces</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Real-Time Telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Global & Social Circuit</span>
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
        <div className="flex items-center gap-2 pt-4 pb-2">
          <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'global'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Circuit</span>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
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
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
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

        {/* Tab Content */}
        {activeTab !== 'stats' ? (
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
        ) : (
          /* Pilot Career Stats Tab */
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

        {/* Footer with User's Rank Summary */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Synced with Global Leaderboard Service</span>
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
