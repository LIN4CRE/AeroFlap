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
  Shield,
  Share2,
  Copy,
  Swords,
  Feather,
  ExternalLink,
  Target
} from 'lucide-react';
import { LeaderboardEntry, PlayerProfile, CommunityChallenge, FriendChallenge } from '../types/game';
import { ALL_LEGENDARY_BADGES } from '../data/quests';
import { loadFriendChallenges, createFriendChallenge } from '../utils/storage';
import { soundFx } from '../utils/audio';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  profile: PlayerProfile;
  communityChallenge: CommunityChallenge;
  onClaimMilestone?: (milestoneIndex: number) => void;
  onClaimCommunityReward?: () => void;
  onStartFriendChallenge?: (challenge: FriendChallenge) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardProps> = ({
  entries,
  profile,
  communityChallenge,
  onClaimMilestone,
  onClaimCommunityReward,
  onStartFriendChallenge,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'challenge' | 'friends' | 'duels' | 'stats'>('global');
  const [bountyFeathers, setBountyFeathers] = useState<number>(100);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friendChallenges, setFriendChallenges] = useState<FriendChallenge[]>(loadFriendChallenges);

  const filteredEntries = activeTab === 'friends'
    ? entries.filter((e) => e.isFriend || e.isCurrentUser || e.username === profile.username)
    : entries;

  const challengePct = Math.min(
    100,
    Math.round((communityChallenge.currentPipes / communityChallenge.targetPipes) * 1000) / 10
  );

  // Generate shareable direct link to beat the user's latest high score
  const targetScore = Math.max(1, profile.highScore);
  const challengeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?challenge=1&challenger=${encodeURIComponent(profile.username)}&targetScore=${targetScore}&bounty=${bountyFeathers}${selectedFriend ? `&opponent=${encodeURIComponent(selectedFriend)}` : ''}`
    : `https://aeroflap.app/?challenge=1&challenger=${encodeURIComponent(profile.username)}&targetScore=${targetScore}&bounty=${bountyFeathers}`;

  const shareText = `⚔️ AEROFLAP FLIGHT DUEL! Pilot ${profile.username} challenges you to beat their personal record of ${targetScore} obstacles! Can you beat it? Fly now to claim a bounty of +${bountyFeathers} Star Feathers 🪶!`;

  const handleCopyLink = async () => {
    soundFx.playClick();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(challengeUrl);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);

      // Record to recent challenges
      const newChal = createFriendChallenge(
        profile.username,
        targetScore,
        bountyFeathers
      );
      setFriendChallenges(loadFriendChallenges());
    } catch {
      // fallback
    }
  };

  const handleShareViaApp = async () => {
    soundFx.playClick();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `AeroFlap Sky Challenge: Beat ${profile.username}'s High Score!`,
          text: shareText,
          url: challengeUrl
        });
        setShareToast('Challenge shared successfully!');
        setTimeout(() => setShareToast(null), 2500);

        createFriendChallenge(profile.username, targetScore, bountyFeathers);
        setFriendChallenges(loadFriendChallenges());
      } catch (e) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleChallengeFriendDirectly = (friendName: string) => {
    soundFx.playClick();
    setSelectedFriend(friendName);
    setActiveTab('duels');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Hall of Aces & Leaderboards</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Global Circuit</span>
              <span aria-hidden="true">·</span>
              <span>Community Challenge</span>
              <span aria-hidden="true">·</span>
              <span>Friend Duels & Bounties</span>
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
        <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'global'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global</span>
            </button>

            <button
              onClick={() => setActiveTab('challenge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === 'challenge'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Community</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] font-mono-nums font-bold rounded-full border border-amber-400/30">
                {challengePct}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'friends'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends</span>
            </button>

            <button
              onClick={() => setActiveTab('duels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'duels'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400 hover:text-amber-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Challenge Friend</span>
              <span className="text-[9px] px-1 py-0.2 bg-amber-400/20 text-amber-300 rounded font-bold">
                NEW
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Career</span>
            </button>
          </div>
        </div>

        {/* Global Tab Top Banner */}
        {activeTab === 'global' && (
          <div className="space-y-2 mb-2 shrink-0">
            {/* Community Challenge Banner */}
            <div
              onClick={() => setActiveTab('challenge')}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/80 border border-purple-500/30 hover:border-purple-400/60 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Operation {communityChallenge.name}
                    </span>
                    <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-mono font-semibold">
                      {challengePct}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate mt-0.5">
                    {communityChallenge.currentPipes.toLocaleString()} / {communityChallenge.targetPipes.toLocaleString()} collective obstacles
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-300 font-semibold shrink-0 ml-2">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Quick Challenge Friend Banner */}
            <div
              onClick={() => setActiveTab('duels')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200 font-medium">
                  Challenge a friend to beat your <strong className="text-amber-300 font-mono">{profile.highScore}</strong> high score for bonus Star Feathers!
                </span>
              </div>
              <span className="text-amber-400 font-bold text-[11px] hover:underline shrink-0">
                Share Link →
              </span>
            </div>
          </div>
        )}

        {/* TAB 1 & 3: GLOBAL / FRIENDS LIST */}
        {(activeTab === 'global' || activeTab === 'friends') && (
          <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
            {filteredEntries.map((item) => {
              const isMe = item.isCurrentUser || item.username === profile.username;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all ${
                    isMe
                      ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/20'
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {item.rank === 1 ? (
                        <Medal className="w-6 h-6 text-amber-400" />
                      ) : item.rank === 2 ? (
                        <Medal className="w-6 h-6 text-slate-300" />
                      ) : item.rank === 3 ? (
                        <Medal className="w-6 h-6 text-amber-600" />
                      ) : (
                        <span className="font-mono-nums font-bold text-xs text-slate-400">
                          #{item.rank}
                        </span>
                      )}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700/60 shrink-0">
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
                      <div className="flex items-center gap-1.5 flex-wrap">
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

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono-nums font-black text-base text-white block">
                        {item.score}
                      </span>
                      <span className="text-[10px] text-slate-400">Score</span>
                    </div>

                    {/* Challenge button next to friends */}
                    {!isMe && (
                      <button
                        onClick={() => handleChallengeFriendDirectly(item.username)}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-xs font-semibold flex items-center gap-1"
                        title={`Challenge ${item.username} to beat your record`}
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Duel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: COMMUNITY CHALLENGE TAB */}
        {activeTab === 'challenge' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-5 pr-1">
            <div className="bg-gradient-to-b from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Global Community Challenge
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

        {/* TAB 4: CHALLENGE FRIEND (Direct Link & Bonus Star Feathers) */}
        {activeTab === 'duels' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-5 pr-1">
            {/* Challenge Creator Hero Card */}
            <div className="relative rounded-3xl p-5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl overflow-hidden space-y-4">
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/25 shrink-0">
                    <Swords className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold font-display text-white">
                        Friend Flight Challenge
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                        DIRECT INVITE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Share a direct link to your personal best score. When your friend beats it, they unlock the bonus Star Feathers bounty!
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium block">Your Record to Beat</span>
                  <span className="font-mono-nums font-black text-2xl text-amber-300">
                    {targetScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Obstacles</span>
                </div>
              </div>

              {/* Bounty Selector */}
              <div className="pt-2 border-t border-amber-500/20">
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Bonus Star Feathers Bounty:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        soundFx.playClick();
                        setBountyFeathers(amount);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        bountyFeathers === amount
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Feather className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-mono">+{amount}</span>
                      </div>
                      <span className="text-[10px] font-normal text-slate-400">
                        {amount === 100 ? 'Standard' : amount === 250 ? 'Challenger' : 'High Stakes'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Challenge Link Box */}
              <div className="pt-2 border-t border-amber-500/20 space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Shareable Challenge Link:</span>
                  {selectedFriend && (
                    <span className="text-[11px] text-sky-400 font-normal">
                      Targeted to @{selectedFriend}
                    </span>
                  )}
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={challengeUrl}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
                  >
                    {copiedToast ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-900" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleShareViaApp}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-98"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Invitation via Social / Messaging</span>
                  </button>
                </div>
              </div>

              {/* Message Preview Box */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Message Preview:
                </span>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">
                  "{shareText}"
                </p>
              </div>
            </div>

            {/* Recent / Active Friend Duels */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recent Flight Duels & Sent Challenges</span>
                </span>
                <span className="text-[11px] text-slate-500">Live Bounties</span>
              </div>

              <div className="space-y-2">
                {friendChallenges.map((duel) => (
                  <div
                    key={duel.id}
                    className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold shrink-0">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">vs. {duel.challengerName}</span>
                          <span className="text-[10px] text-slate-400">· {duel.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Target Score: <strong className="text-white font-mono">{duel.targetScore}</strong> obstacles · Bounty: <span className="text-amber-400 font-semibold">+{duel.bountyFeathers} 🪶</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        duel.status === 'won'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {duel.status === 'won' ? 'Conquered ✓' : 'Awaiting Duel'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PILOT CAREER STATS TAB */}
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
            <span>Synced with Global Leaderboard & Duel Circuit</span>
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
