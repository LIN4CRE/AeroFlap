import React from 'react';
import { Sliders, Sparkles, Trophy, Target, Bell, Settings, Shield, WifiOff } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { ALL_LEGENDARY_BADGES } from '../data/quests';

interface TopNavProps {
  profile: PlayerProfile;
  unreadNotifsCount: number;
  isOnline: boolean;
  onOpenObstacles: () => void;
  onOpenSkins: () => void;
  onOpenLeaderboard: () => void;
  onOpenQuests: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  profile,
  unreadNotifsCount,
  isOnline,
  onOpenObstacles,
  onOpenSkins,
  onOpenLeaderboard,
  onOpenQuests,
  onOpenSettings,
  onOpenNotifications,
  onOpenAuth
}) => {
  const equippedBadge = profile.equippedBadgeId
    ? ALL_LEGENDARY_BADGES.find((b) => b.id === profile.equippedBadgeId)
    : null;

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shrink-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold font-display tracking-tight text-white select-none">
            AeroFlap
          </span>
          {!isOnline && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <WifiOff className="w-3 h-3" />
              <span>Offline Mode</span>
            </span>
          )}
        </div>

        {/* Zone 2: 4-6 clean text navigation links (single line, no pills) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <button
            onClick={onOpenObstacles}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Obstacles</span>
          </button>

          <button
            onClick={onOpenSkins}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fleet Skins</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={onOpenQuests}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-sky-400" />
            <span>Daily Quests</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Notification Alert Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile / Pilot ID Capsule */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              equippedBadge
                ? 'bg-amber-950/40 hover:bg-amber-900/50 text-white border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800 hover:bg-slate-700/80 text-white border-slate-700'
            }`}
          >
            {equippedBadge ? (
              <span className="text-sm select-none" title={`Equipped Legendary Badge: ${equippedBadge.name}`}>
                {equippedBadge.icon}
              </span>
            ) : (
              <Shield className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span className="truncate max-w-[90px]">{profile.username}</span>
            <span className={`text-[10px] font-mono-nums ${equippedBadge ? 'text-amber-400' : 'text-sky-400'}`}>
              Lv.{profile.level}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
