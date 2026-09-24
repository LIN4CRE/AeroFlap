import React from 'react';
import { X, Sparkles, Zap, Sliders, ShieldAlert, Check, CloudSun, Sunset, Snowflake, Orbit, SunMedium, Monitor } from 'lucide-react';
import { ObstacleSettings, ObstacleTheme, SkyTheme, GapSize, ObstacleSpeed, ObstaclePattern, ObstacleSpacing } from '../types/game';

interface CustomizerProps {
  settings: ObstacleSettings;
  onSave: (newSettings: ObstacleSettings) => void;
  onClose: () => void;
}

const SKY_THEME_OPTIONS: Array<{
  id: SkyTheme;
  name: string;
  desc: string;
  obstacleEffect: string;
  badge: string;
  gradient: string;
  accent: string;
  icon: string;
}> = [
  {
    id: 'CYBER_NEON',
    name: 'Cyber Neon',
    desc: 'Midnight synthwave sky with glowing cyber gridlines and futuristic skyline silhouettes.',
    obstacleEffect: 'Obstacles glow with neon cyan beams and magenta nodes',
    badge: 'Popular',
    gradient: 'from-[#040714] via-[#0c1733] to-[#1e1b4b]',
    accent: '#06b6d4',
    icon: '🌆'
  },
  {
    id: 'SUNSET_HORIZON',
    name: 'Sunset Horizon',
    desc: 'Radiant purple-to-gold dusk with a glowing solar corona and warm twilight clouds.',
    obstacleEffect: 'Obstacles shift to warm bronze metal, gold amber & solar orange',
    badge: 'Warm',
    gradient: 'from-[#311042] via-[#831843] to-[#fde047]',
    accent: '#ea580c',
    icon: '🌅'
  },
  {
    id: 'ARCTIC_STORM',
    name: 'Arctic Storm',
    desc: 'Sub-zero glacial blizzard with drifting snowflakes, frost sheen, and frozen peaks.',
    obstacleEffect: 'Obstacles freeze into glacial cyan ice, frost steel & ice glints',
    badge: 'Glacial',
    gradient: 'from-[#082f49] via-[#0284c7] to-[#bae6fd]',
    accent: '#38bdf8',
    icon: '❄️'
  },
  {
    id: 'DARK_NEBULA',
    name: 'Dark Nebula',
    desc: 'Cosmic galactic void filled with interstellar stardust, purple auroras, and supernovas.',
    obstacleEffect: 'Obstacles shift to obsidian shadow pylons with violet runes',
    badge: 'Cosmic',
    gradient: 'from-[#020617] via-[#3b0764] to-[#581c87]',
    accent: '#c084fc',
    icon: '🌌'
  },
  {
    id: 'DAYLIGHT_AZURE',
    name: 'Daylight Azure',
    desc: 'Crisp bright azure midday skies with sunny horizons and soft drifting clouds.',
    obstacleEffect: 'Obstacles feature vibrant retro emerald green and classic pipes',
    badge: 'Daylight',
    gradient: 'from-[#0284c7] via-[#38bdf8] to-[#e0f2fe]',
    accent: '#0284c7',
    icon: '☀️'
  },
  {
    id: 'RETRO_AMBER',
    name: 'Retro Amber CRT',
    desc: '1984 amber phosphor arcade monitor with CRT scanlines and perspective vector lines.',
    obstacleEffect: 'Obstacles transform into glowing amber phosphor wireframes',
    badge: 'Vintage',
    gradient: 'from-[#0f0b04] via-[#78350f] to-[#fbbf24]',
    accent: '#f59e0b',
    icon: '📟'
  }
];

const THEME_OPTIONS: Array<{
  id: ObstacleTheme;
  name: string;
  desc: string;
  badge: string;
  previewColor: string;
}> = [
  {
    id: 'CLASSIC_PIPES',
    name: 'Classic Pipes',
    desc: 'Iconic emerald green pipes with cylindrical collars and retro nostalgia.',
    badge: 'Retro',
    previewColor: '#22c55e'
  },
  {
    id: 'CYBER_LASER',
    name: 'Cyber Laser',
    desc: 'Futuristic dark alloy pylons with glowing cyan neon guides and plasma nodes.',
    badge: 'Popular',
    previewColor: '#06b6d4'
  },
  {
    id: 'STEAMPUNK_SPIRES',
    name: 'Steampunk Spires',
    desc: 'Heavy brass columns with rotating clockwork gears and copper rivets.',
    badge: 'Mechanical',
    previewColor: '#d97706'
  },
  {
    id: 'PIXEL_BRICKS',
    name: '8-Bit Pixel Bricks',
    desc: 'Chiseled arcade brick blocks with 1980s retro mortar aesthetics.',
    badge: 'Arcade',
    previewColor: '#ef4444'
  },
  {
    id: 'CRYSTAL_SHARDS',
    name: 'Crystal Shards',
    desc: 'Faceted purple quartz clusters with crystalline light refraction.',
    badge: 'Mystic',
    previewColor: '#a855f7'
  },
  {
    id: 'CANDY_CANES',
    name: 'Candy Canes',
    desc: 'Peppermint candy cane pillars with sweet icing swirls.',
    badge: 'Playful',
    previewColor: '#f43f5e'
  },
  {
    id: 'DARK_NEBULA',
    name: 'Dark Nebula',
    desc: 'Obsidian space obelisks etched with glowing celestial runes.',
    badge: 'Void',
    previewColor: '#8b5cf6'
  }
];

export const ObstacleCustomizerModal: React.FC<CustomizerProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const [current, setCurrent] = React.useState<ObstacleSettings>({ ...settings });

  const handleApply = () => {
    onSave(current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-sky-400" />
              <span>Obstacle Workshop</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Dynamic Geometry</span>
              <span aria-hidden="true">·</span>
              <span>Visual Themes & Physical Modifiers</span>
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

        {/* Scrollable Configuration Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Section 1: Sky Environment & Atmosphere */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Sky Atmosphere & Canvas Horizon
              </label>
              <span className="text-[11px] text-sky-400 font-medium">Alters background & obstacle colors</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SKY_THEME_OPTIONS.map((sky) => {
                const active = (current.skyTheme || 'CYBER_NEON') === sky.id;
                return (
                  <button
                    key={sky.id}
                    onClick={() => setCurrent({ ...current, skyTheme: sky.id })}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all border ${
                      active
                        ? 'bg-slate-800 border-sky-500 shadow-md ring-1 ring-sky-500/40'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg bg-gradient-to-br ${sky.gradient} border border-white/10 shadow-inner`}>
                      {sky.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-100 truncate">{sky.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-700/60 text-slate-300">
                            {sky.badge}
                          </span>
                        </div>
                        {active && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{sky.desc}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-sky-400/90 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sky.accent }} />
                        <span className="truncate">{sky.obstacleEffect}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Themes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Obstacle Architecture Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((theme) => {
                const active = current.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setCurrent({ ...current, theme: theme.id })}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all border ${
                      active
                        ? 'bg-slate-800 border-sky-500/80 shadow-md ring-1 ring-sky-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 shadow-sm"
                      style={{ backgroundColor: `${theme.previewColor}25`, border: `2px solid ${theme.previewColor}` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.previewColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-100 truncate">{theme.name}</span>
                        {active && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{theme.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Physical Gap Size */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Flight Gap Clearance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['EASY', 'NORMAL', 'HARD', 'CHAOS_DYNAMIC'] as GapSize[]).map((gap) => (
                <button
                  key={gap}
                  onClick={() => setCurrent({ ...current, gapSize: gap })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-colors border ${
                    current.gapSize === gap
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {gap === 'CHAOS_DYNAMIC' ? 'Dynamic' : gap.charAt(0) + gap.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Scroll Speed */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Velocity & Obstacle Speed
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['CHILL', 'STANDARD', 'HYPER', 'PROGRESSIVE'] as ObstacleSpeed[]).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setCurrent({ ...current, speed: spd })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-colors border ${
                    current.speed === spd
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {spd === 'PROGRESSIVE' ? 'Accelerating' : spd.charAt(0) + spd.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Movement Pattern */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Kinetic Movement Pattern
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrent({ ...current, pattern: 'STATIC' })}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border ${
                  current.pattern === 'STATIC'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Static Pillars</span>
              </button>
              <button
                onClick={() => setCurrent({ ...current, pattern: 'VERTICAL_BOB' })}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border ${
                  current.pattern === 'VERTICAL_BOB'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Vertical Bobbing</span>
              </button>
            </div>
          </div>

          {/* Section 5: Obstacle Spacing & Glow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Distance Frequency
              </label>
              <div className="flex gap-2">
                {(['WIDE', 'NORMAL', 'TIGHT'] as ObstacleSpacing[]).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => setCurrent({ ...current, spacing })}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                      current.spacing === spacing
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {spacing.charAt(0) + spacing.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Neon Particle Glow</span>
                  <span className="text-[11px] text-slate-500">Enhanced bloom lighting</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={current.glowEffect}
                onChange={(e) => setCurrent({ ...current, glowEffect: e.target.checked })}
                className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all"
          >
            Apply Workshop Settings
          </button>
        </div>
      </div>
    </div>
  );
};
