import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Share2,
  Sliders,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Pause,
  Feather,
  Flame,
  Award
} from 'lucide-react';
import {
  GameState,
  ObstacleSettings,
  PlayerProfile,
  CharacterSkin,
  UserPreferences,
  DailyQuest
} from '../types/game';
import { PhysicsEngine } from '../game/physics';
import { GameRenderer } from '../game/renderer';
import { soundFx } from '../utils/audio';
import { haptics } from '../utils/haptics';

interface GameCanvasProps {
  profile: PlayerProfile;
  obstacleSettings: ObstacleSettings;
  equippedSkin: CharacterSkin;
  preferences: UserPreferences;
  onGameOver: (score: number, feathers: number) => void;
  onOpenShareModal: (score: number, feathers: number) => void;
  onOpenObstacles: () => void;
  onOpenSkins: () => void;
  onOpenLeaderboard: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  profile,
  obstacleSettings,
  equippedSkin,
  preferences,
  onGameOver,
  onOpenShareModal,
  onOpenObstacles,
  onOpenSkins,
  onOpenLeaderboard
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [runFeathers, setRunFeathers] = useState<number>(0);
  const [lastRunStats, setLastRunStats] = useState<{ score: number; feathers: number; isNewRecord: boolean }>({
    score: 0,
    feathers: 0,
    isNewRecord: false
  });

  const physicsRef = useRef<PhysicsEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const touchStartYRef = useRef<number>(0);

  // Initialize engine & renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 600;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    physicsRef.current = new PhysicsEngine(width, height, equippedSkin.id);
    rendererRef.current = new GameRenderer(ctx, width, height);

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      physicsRef.current?.reset(equippedSkin.id);
      if (physicsRef.current) {
        physicsRef.current.canvasWidth = w;
        physicsRef.current.canvasHeight = h;
        physicsRef.current.groundY = h - 70;
      }
      rendererRef.current?.resize(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update skin if equipped changes
  useEffect(() => {
    if (physicsRef.current) {
      physicsRef.current.bird.skinId = equippedSkin.id;
    }
  }, [equippedSkin]);

  // Primary Action: Flap
  const triggerFlap = useCallback(() => {
    if (gameState === 'TITLE_MENU') {
      physicsRef.current?.reset(equippedSkin.id);
      setGameState('PLAYING');
      setCurrentScore(0);
      setRunFeathers(0);
      soundFx.playFlap(equippedSkin.pitchModifier);
      physicsRef.current?.flap(equippedSkin.pitchModifier);
      // Distinct Game Start haptic pattern (ramping energetic spool)
      haptics.trigger('GAME_START');
      return;
    }

    if (gameState === 'PLAYING' && physicsRef.current?.bird.alive) {
      physicsRef.current.flap(equippedSkin.pitchModifier);
      soundFx.playFlap(equippedSkin.pitchModifier);
      haptics.trigger('FLAP');
    }
  }, [gameState, equippedSkin]);

  // Secondary Action: Quick Dive (via swipe down)
  const triggerQuickDive = useCallback(() => {
    if (gameState === 'PLAYING' && preferences.swipeDiveEnabled && physicsRef.current?.bird.alive) {
      physicsRef.current.quickDive();
      haptics.trigger('QUICK_DIVE');
    }
  }, [gameState, preferences.swipeDiveEnabled]);

  // Crash / Game Over Handler
  const handleCrash = useCallback(() => {
    soundFx.playHit();
    // Distinct Collision haptic pattern (heavy visceral crunch and secondary shudder)
    haptics.trigger('COLLISION');

    const finalScore = physicsRef.current?.score || 0;
    const finalFeathers = physicsRef.current?.feathersCollectedInRun || 0;
    const isNew = finalScore > profile.highScore;

    setLastRunStats({
      score: finalScore,
      feathers: finalFeathers,
      isNewRecord: isNew
    });

    setGameState('GAME_OVER');
    onGameOver(finalScore, finalFeathers);
  }, [profile.highScore, onGameOver]);

  // Game Loop
  useEffect(() => {
    const loop = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      if (physicsRef.current && rendererRef.current) {
        if (gameState === 'PLAYING') {
          physicsRef.current.update(
            dt,
            obstacleSettings,
            () => {
              soundFx.playScore();
              haptics.trigger('SCORE_POINT');
              setCurrentScore(physicsRef.current?.score || 0);
            },
            () => {
              soundFx.playCoin();
              // Distinct Feather Collection haptic pattern (crisp tactile double-tap)
              haptics.trigger('FEATHER_COLLECT');
              setRunFeathers(physicsRef.current?.feathersCollectedInRun || 0);
            },
            () => {
              handleCrash();
            }
          );
        }

        rendererRef.current.render(
          physicsRef.current,
          preferences.theme,
          obstacleSettings,
          preferences.highContrast
        );
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState, obstacleSettings, preferences.theme, preferences.highContrast, handleCrash]);

  // Touch gesture listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (deltaY > 40 && preferences.swipeDiveEnabled) {
      triggerQuickDive();
    } else {
      triggerFlap();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerFlap();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        triggerQuickDive();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        if (gameState === 'PLAYING') setGameState('PAUSED');
        else if (gameState === 'PAUSED') setGameState('PLAYING');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlap, triggerQuickDive, gameState]);

  const handleRestart = () => {
    physicsRef.current?.reset(equippedSkin.id);
    setCurrentScore(0);
    setRunFeathers(0);
    setGameState('PLAYING');
    soundFx.playFlap(equippedSkin.pitchModifier);
    haptics.trigger('GAME_START');
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden select-none cursor-pointer"
      onClick={gameState !== 'GAME_OVER' && gameState !== 'PAUSED' ? triggerFlap : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 60fps HTML5 Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* IN-GAME HUD OVERLAY (Only during PLAYING / PAUSED) */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          {/* Current Score in big tabular numbers */}
          <div className="flex items-center gap-3">
            <span className="font-mono-nums font-black text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {currentScore}
            </span>
            {currentScore > profile.highScore && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-md shadow-sm">
                NEW RECORD
              </span>
            )}
          </div>

          {/* Feathers collected in current flight */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-amber-400">
              <Feather className="w-3.5 h-3.5" />
              <span className="font-mono-nums font-bold text-xs">{runFeathers}</span>
            </div>

            {/* Pause trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGameState(gameState === 'PLAYING' ? 'PAUSED' : 'PLAYING');
              }}
              className="p-2 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white rounded-full pointer-events-auto transition-colors border border-white/10"
              aria-label="Pause Game"
            >
              {gameState === 'PLAYING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TITLE MENU OVERLAY */}
      {gameState === 'TITLE_MENU' && (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 bg-slate-950/45 backdrop-blur-[2px] z-20 pointer-events-auto">
          {/* Top Brand Banner */}
          <div className="text-center pt-8">
            <span className="text-xs font-semibold tracking-widest text-sky-400 uppercase">
              Next-Gen Flight Arcade
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight mt-1 drop-shadow-md">
              AeroFlap Skies
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-2">
              <span>{equippedSkin.name}</span>
              <span aria-hidden="true">·</span>
              <span>{obstacleSettings.theme.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Center Flap Launch Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={triggerFlap}
              className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-10 h-10 ml-1.5 fill-current" />
              <span className="absolute -bottom-8 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-slate-200">
                Tap Screen to Fly
              </span>
            </button>
          </div>

          {/* Bottom Quick Hub Buttons */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-2 pb-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenObstacles();
              }}
              className="flex flex-col items-center p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 text-xs font-semibold transition-all backdrop-blur-md"
            >
              <Sliders className="w-4 h-4 text-sky-400 mb-1" />
              <span>Obstacles</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSkins();
              }}
              className="flex flex-col items-center p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 text-xs font-semibold transition-all backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
              <span>Hangar</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLeaderboard();
              }}
              className="flex flex-col items-center p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 text-xs font-semibold transition-all backdrop-blur-md"
            >
              <Trophy className="w-4 h-4 text-amber-400 mb-1" />
              <span>Ranks</span>
            </button>
          </div>
        </div>
      )}

      {/* PAUSED OVERLAY */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-md z-20 pointer-events-auto">
          <h2 className="text-3xl font-extrabold font-display text-white mb-2">Flight Paused</h2>
          <p className="text-xs text-slate-400 mb-6">Take a breath or recalibrate your flight gear</p>
          <div className="flex gap-3">
            <button
              onClick={() => setGameState('PLAYING')}
              className="py-3 px-6 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Flight</span>
            </button>
            <button
              onClick={handleRestart}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER SUMMARY MODAL / OVERLAY */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md z-20 pointer-events-auto animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-center">
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Flight Terminated
              </span>
              <h2 className="text-2xl font-black font-display text-white mt-0.5">Mission Debrief</h2>
            </div>

            {/* Scorecard Box */}
            <div className="my-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
              <div className="text-slate-400 text-xs mb-1">Score</div>
              <div className="font-mono-nums font-black text-5xl text-white">
                {lastRunStats.score}
              </div>

              {lastRunStats.isNewRecord && (
                <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>New All-Time High Record!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Best Record</span>
                  <span className="font-mono-nums font-bold text-slate-200 text-base">
                    {Math.max(profile.highScore, lastRunStats.score)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Feathers Earned</span>
                  <span className="font-mono-nums font-bold text-amber-400 text-base">
                    +{lastRunStats.feathers}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleRestart}
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Fly Again</span>
              </button>

              <button
                onClick={() => onOpenShareModal(lastRunStats.score, lastRunStats.feathers)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Share Flight Scorecard</span>
              </button>
            </div>

            {/* Secondary Hub shortcuts */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <button
                onClick={onOpenObstacles}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Tweak Obstacles
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={onOpenSkins}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Change Skin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
