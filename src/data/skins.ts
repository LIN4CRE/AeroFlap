import { CharacterSkin } from '../types/game';

export const INITIAL_SKINS: CharacterSkin[] = [
  {
    id: 'classic_canary',
    name: 'Classic Canary',
    description: 'The legendary golden pioneer of the skies. Agile and reliable.',
    rarity: 'Common',
    costFeathers: 0,
    levelReq: 1,
    particleType: 'feathers',
    pitchModifier: 1.0,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'cyber_drone',
    name: 'Cyber Mech-01',
    description: 'Equipped with dual ion thrusters and aerodynamic carbon plating.',
    rarity: 'Rare',
    costFeathers: 120,
    levelReq: 2,
    particleType: 'cyber_trail',
    pitchModifier: 1.25,
    unlocked: false
  },
  {
    id: 'phoenix_flame',
    name: 'Solar Phoenix',
    description: 'Born from solar embers. Leaves a trail of brilliant incandescent fire.',
    rarity: 'Epic',
    costFeathers: 300,
    levelReq: 4,
    particleType: 'fire_embers',
    pitchModifier: 0.95,
    unlocked: false
  },
  {
    id: 'golden_monarch',
    name: 'Golden Monarch',
    description: 'Crafted from pure 24k celestial gold. Shimmers with royal diamond glints.',
    rarity: 'Legendary',
    costFeathers: 650,
    levelReq: 6,
    particleType: 'gold_stars',
    pitchModifier: 1.35,
    unlocked: false
  },
  {
    id: 'pixel_arcade',
    name: '8-Bit Retro Bird',
    description: 'Rendered in nostalgic 1984 pixel art with chiptune resonance.',
    rarity: 'Common',
    costFeathers: 80,
    levelReq: 2,
    particleType: 'retro_pixels',
    pitchModifier: 1.5,
    unlocked: false
  },
  {
    id: 'void_raven',
    name: 'Void Raven',
    description: 'Travels through dimensional shadows, shedding cosmic violet stardust.',
    rarity: 'Epic',
    costFeathers: 350,
    levelReq: 5,
    particleType: 'void_runes',
    pitchModifier: 0.8,
    unlocked: false
  },
  {
    id: 'steampunk_aviator',
    name: 'Steampunk Owl',
    description: 'Clockwork brass wings with brass goggles and miniature steam exhaust.',
    rarity: 'Rare',
    costFeathers: 180,
    levelReq: 3,
    particleType: 'steam_puff',
    pitchModifier: 0.9,
    unlocked: false
  },
  {
    id: 'ethereal_ghost',
    name: 'Phantom Spirit',
    description: 'A friendly floating phantom that glides effortlessly through obstacles.',
    rarity: 'Rare',
    costFeathers: 220,
    levelReq: 3,
    particleType: 'ghost_mist',
    pitchModifier: 1.1,
    unlocked: false
  },
  {
    id: 'kawaii_chick',
    name: 'Kawaii Pip',
    description: 'An adorable blushing chick spreading floating sweet hearts.',
    rarity: 'Common',
    costFeathers: 90,
    levelReq: 1,
    particleType: 'pink_hearts',
    pitchModifier: 1.4,
    unlocked: false
  },
  {
    id: 'cosmic_ufo',
    name: 'Celestial Saucer',
    description: 'Extraterrestrial flying disc with anti-gravity tractor rings.',
    rarity: 'Seasonal',
    costFeathers: 500,
    levelReq: 5,
    particleType: 'cosmic_rings',
    pitchModifier: 1.3,
    unlocked: false
  }
];
