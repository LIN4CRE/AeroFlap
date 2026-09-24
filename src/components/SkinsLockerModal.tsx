import React from 'react';
import { X, Lock, Check, Sparkles, Feather, Shield, Volume2 } from 'lucide-react';
import { CharacterSkin, PlayerProfile, SkinId } from '../types/game';
import { soundFx } from '../utils/audio';
import { Skin3DPreview } from './Skin3DPreview';

interface SkinsLockerProps {
  skins: CharacterSkin[];
  profile: PlayerProfile;
  onEquipSkin: (skinId: SkinId) => void;
  onUnlockSkin: (skin: CharacterSkin) => void;
  onClose: () => void;
}

export const SkinsLockerModal: React.FC<SkinsLockerProps> = ({
  skins,
  profile,
  onEquipSkin,
  onUnlockSkin,
  onClose
}) => {
  const [selectedSkin, setSelectedSkin] = React.useState<CharacterSkin>(
    skins.find((s) => s.id === profile.avatarSkin) || skins[0]
  );

  const isEquipped = profile.avatarSkin === selectedSkin.id;
  const canAfford = profile.starFeathers >= selectedSkin.costFeathers;
  const meetsLevel = profile.level >= selectedSkin.levelReq;

  const handleTestSound = (pitch: number) => {
    soundFx.playFlap(pitch);
  };

  const getRarityBadgeColor = (rarity: CharacterSkin['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'Epic':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Rare':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
      case 'Seasonal':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Common':
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Hangar & Character Skins</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>AeroFlap Fleet</span>
              <span aria-hidden="true">·</span>
              <span>Progression & Visual Customization</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Feathers Currency Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Feather className="w-4 h-4 text-amber-400" />
              <span className="font-mono-nums font-bold text-sm text-amber-300">
                {profile.starFeathers}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split into Grid and Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 py-5 overflow-y-auto">
          {/* Skins Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
            {skins.map((skin) => {
              const isSelected = selectedSkin.id === skin.id;
              const isEquippedSkin = profile.avatarSkin === skin.id;

              return (
                <button
                  key={skin.id}
                  onClick={() => setSelectedSkin(skin)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border relative ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 ring-2 ring-sky-500/30 shadow-lg'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator */}
                  {isEquippedSkin && (
                    <span className="absolute top-2 right-2 p-1 bg-sky-500 text-white rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  {!skin.unlocked && (
                    <span className="absolute top-2 left-2 p-1 bg-slate-800 text-slate-400 rounded-full">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}

                  {/* Avatar Icon Placeholder */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center my-2 shadow-inner border border-slate-700/50">
                    <div className="text-2xl">
                      {skin.id === 'classic_canary' && '🐤'}
                      {skin.id === 'cyber_drone' && '🤖'}
                      {skin.id === 'phoenix_flame' && '🔥'}
                      {skin.id === 'golden_monarch' && '👑'}
                      {skin.id === 'pixel_arcade' && '👾'}
                      {skin.id === 'void_raven' && '🔮'}
                      {skin.id === 'steampunk_aviator' && '🦉'}
                      {skin.id === 'ethereal_ghost' && '👻'}
                      {skin.id === 'kawaii_chick' && '🐥'}
                      {skin.id === 'cosmic_ufo' && '🛸'}
                    </div>
                  </div>

                  <span className="font-semibold text-xs text-slate-100 truncate w-full">
                    {skin.name}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border mt-1 ${getRarityBadgeColor(skin.rarity)}`}>
                    {skin.rarity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details & Inspection Panel */}
          <div className="md:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getRarityBadgeColor(selectedSkin.rarity)}`}>
                  {selectedSkin.rarity} Tier
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Level {selectedSkin.levelReq}+</span>
                </span>
              </div>

              {/* 3D-Like Rotating Turntable Preview Stage */}
              <Skin3DPreview
                skin={selectedSkin}
                onTestSound={() => handleTestSound(selectedSkin.pitchModifier)}
              />

              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">{selectedSkin.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedSkin.description}
                </p>
              </div>

              {/* Attributes list */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400">Particle Exhaust</span>
                  <span className="font-semibold text-sky-400 capitalize">
                    {selectedSkin.particleType.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400">Audio Pitch</span>
                  <button
                    onClick={() => handleTestSound(selectedSkin.pitchModifier)}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{selectedSkin.pitchModifier}x Test</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400">Pilot Level Req</span>
                  <span className={`font-semibold ${meetsLevel ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Level {selectedSkin.levelReq} {meetsLevel ? '(Eligible)' : '(Locked)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-5 border-t border-slate-800">
              {selectedSkin.unlocked ? (
                <button
                  disabled={isEquipped}
                  onClick={() => onEquipSkin(selectedSkin.id)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isEquipped
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98]'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Equipped in Hangar</span>
                    </>
                  ) : (
                    <span>Equip Character</span>
                  )}
                </button>
              ) : (
                <button
                  disabled={!canAfford || !meetsLevel}
                  onClick={() => onUnlockSkin(selectedSkin)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    canAfford && meetsLevel
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    Unlock for {selectedSkin.costFeathers} Feathers
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
