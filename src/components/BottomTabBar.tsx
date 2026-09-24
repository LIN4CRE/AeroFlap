import React from 'react';
import { Play, Sliders, Sparkles, Trophy, Target } from 'lucide-react';

interface BottomTabBarProps {
  onOpenPlay: () => void;
  onOpenObstacles: () => void;
  onOpenSkins: () => void;
  onOpenLeaderboard: () => void;
  onOpenQuests: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  onOpenPlay,
  onOpenObstacles,
  onOpenSkins,
  onOpenLeaderboard,
  onOpenQuests
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-2 py-1">
      <div className="grid grid-cols-5 items-center h-14">
        <button
          onClick={onOpenPlay}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-sky-400 font-semibold"
          aria-label="Play Flight"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="text-[10px] tracking-tight mt-0.5">Fly</span>
        </button>

        <button
          onClick={onOpenObstacles}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200"
          aria-label="Obstacles"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Obstacles</span>
        </button>

        <button
          onClick={onOpenSkins}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200"
          aria-label="Fleet Hangar"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] tracking-tight mt-0.5">Fleet</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200"
          aria-label="Leaderboard"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] tracking-tight mt-0.5">Ranks</span>
        </button>

        <button
          onClick={onOpenQuests}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200"
          aria-label="Quests"
        >
          <Target className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] tracking-tight mt-0.5">Quests</span>
        </button>
      </div>
    </div>
  );
};
