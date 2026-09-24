/**
 * Flappy Bird Physics Engine
 */
import { ObstacleSettings, SkinId } from '../types/game';

export interface PipePair {
  id: string;
  x: number;
  width: number;
  topHeight: number;
  bottomY: number; // top of bottom pipe
  bottomHeight: number;
  gap: number;
  passed: boolean;
  baseY: number;
  bobPhase: number;
  pulsePhase: number;
}

export interface StarFeatherItem {
  id: string;
  x: number;
  y: number;
  baseY: number;
  radius: number;
  collected: boolean;
  bobPhase: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: string;
}

export interface BirdState {
  x: number;
  y: number;
  radius: number;
  vy: number;
  rotation: number;
  flapTime: number;
  alive: boolean;
  skinId: SkinId;
}

export class PhysicsEngine {
  public gravity: number = 0.38;
  public flapStrength: number = -6.8;
  public diveStrength: number = 5.5;
  public terminalVelocity: number = 10;
  public bird: BirdState;
  public pipes: PipePair[] = [];
  public coins: StarFeatherItem[] = [];
  public particles: Particle[] = [];
  public groundY: number = 0;
  public canvasWidth: number = 400;
  public canvasHeight: number = 600;
  public nextPipeDistance: number = 0;
  public score: number = 0;
  public feathersCollectedInRun: number = 0;
  public combo: number = 0;

  constructor(canvasWidth: number, canvasHeight: number, skinId: SkinId = 'classic_canary') {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groundY = canvasHeight - 70;
    this.bird = {
      x: canvasWidth * 0.28,
      y: canvasHeight * 0.45,
      radius: 17,
      vy: 0,
      rotation: 0,
      flapTime: 0,
      alive: true,
      skinId
    };
  }

  public reset(skinId?: SkinId) {
    this.groundY = this.canvasHeight - 70;
    this.bird = {
      x: this.canvasWidth * 0.28,
      y: this.canvasHeight * 0.45,
      radius: 17,
      vy: 0,
      rotation: 0,
      flapTime: 0,
      alive: true,
      skinId: skinId || this.bird.skinId
    };
    this.pipes = [];
    this.coins = [];
    this.particles = [];
    this.score = 0;
    this.feathersCollectedInRun = 0;
    this.combo = 0;
    this.nextPipeDistance = 140; // initial grace distance
  }

  public flap(pitchModifier: number = 1.0) {
    if (!this.bird.alive) return;
    this.bird.vy = this.flapStrength;
    this.bird.flapTime = Date.now();

    // Spawn flap particles
    this.spawnFlapParticles();
  }

  public quickDive() {
    if (!this.bird.alive) return;
    this.bird.vy = Math.max(this.bird.vy, this.diveStrength);
  }

  public getPipeGap(settings: ObstacleSettings): number {
    switch (settings.gapSize) {
      case 'EASY':
        return 175;
      case 'HARD':
        return 115;
      case 'CHAOS_DYNAMIC':
        return 110 + Math.random() * 65;
      case 'NORMAL':
      default:
        return 140;
    }
  }

  public getScrollSpeed(settings: ObstacleSettings): number {
    let base = 2.4;
    switch (settings.speed) {
      case 'CHILL':
        base = 1.8;
        break;
      case 'HYPER':
        base = 3.5;
        break;
      case 'PROGRESSIVE':
        base = 2.2 + Math.min(this.score * 0.05, 1.8);
        break;
      case 'STANDARD':
      default:
        base = 2.5;
        break;
    }
    return base;
  }

  public getPipeSpacing(settings: ObstacleSettings): number {
    switch (settings.spacing) {
      case 'WIDE':
        return 320;
      case 'TIGHT':
        return 210;
      case 'NORMAL':
      default:
        return 260;
    }
  }

  public spawnPipe(settings: ObstacleSettings) {
    const gap = this.getPipeGap(settings);
    const pipeWidth = 64;
    const minTop = 60;
    const maxTop = this.groundY - gap - 60;
    const topHeight = minTop + Math.random() * (maxTop - minTop);
    const bottomY = topHeight + gap;
    const bottomHeight = this.groundY - bottomY;

    const pipe: PipePair = {
      id: 'pipe_' + Date.now() + '_' + Math.random(),
      x: this.canvasWidth + 20,
      width: pipeWidth,
      topHeight,
      bottomY,
      bottomHeight,
      gap,
      passed: false,
      baseY: topHeight,
      bobPhase: Math.random() * Math.PI * 2,
      pulsePhase: 0
    };

    this.pipes.push(pipe);

    // 60% chance to spawn a collectible Star Feather inside or just past the gap
    if (Math.random() < 0.65) {
      const coinY = topHeight + gap * (0.35 + Math.random() * 0.3);
      this.coins.push({
        id: 'coin_' + Date.now(),
        x: pipe.x + pipeWidth * 0.5,
        y: coinY,
        baseY: coinY,
        radius: 12,
        collected: false,
        bobPhase: Math.random() * Math.PI * 2
      });
    }
  }

  public spawnFlapParticles() {
    const count = 5;
    const skin = this.bird.skinId;

    for (let i = 0; i < count; i++) {
      let color = '#fef08a';
      let type = 'feathers';
      if (skin === 'cyber_drone') {
        color = '#38bdf8';
        type = 'cyber';
      } else if (skin === 'phoenix_flame') {
        color = '#f97316';
        type = 'fire';
      } else if (skin === 'golden_monarch') {
        color = '#fbbf24';
        type = 'gold';
      } else if (skin === 'pixel_arcade') {
        color = '#4ade80';
        type = 'pixel';
      } else if (skin === 'void_raven') {
        color = '#c084fc';
        type = 'void';
      } else if (skin === 'steampunk_aviator') {
        color = '#e2e8f0';
        type = 'steam';
      } else if (skin === 'kawaii_chick') {
        color = '#f472b6';
        type = 'heart';
      } else if (skin === 'cosmic_ufo') {
        color = '#2dd4bf';
        type = 'cosmic';
      }

      this.particles.push({
        x: this.bird.x - 10,
        y: this.bird.y + 4 + (Math.random() - 0.5) * 8,
        vx: -1.5 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 2.5,
        life: 1.0,
        maxLife: 20 + Math.random() * 15,
        color,
        size: 3 + Math.random() * 4,
        type
      });
    }
  }

  public update(
    dt: number,
    settings: ObstacleSettings,
    onScorePoint: () => void,
    onCollectCoin: () => void,
    onCrash: () => void
  ) {
    if (!this.bird.alive) {
      // Gentle drop after collision
      if (this.bird.y < this.groundY - this.bird.radius) {
        this.bird.vy += this.gravity * 1.5;
        this.bird.y += this.bird.vy;
      }
      return;
    }

    const scrollSpeed = this.getScrollSpeed(settings);

    // Apply bird gravity and velocity
    this.bird.vy += this.gravity;
    if (this.bird.vy > this.terminalVelocity) {
      this.bird.vy = this.terminalVelocity;
    }
    this.bird.y += this.bird.vy;

    // Bird pitch angle calculation
    if (this.bird.vy < 0) {
      this.bird.rotation = Math.max(-0.45, this.bird.vy * 0.08);
    } else {
      this.bird.rotation = Math.min(Math.PI / 2, (this.bird.vy - 1) * 0.12);
    }

    // Ceiling check
    if (this.bird.y - this.bird.radius <= 0) {
      this.bird.y = this.bird.radius;
      this.bird.vy = 0;
    }

    // Ground collision
    if (this.bird.y + this.bird.radius >= this.groundY) {
      this.bird.y = this.groundY - this.bird.radius;
      this.bird.alive = false;
      onCrash();
      return;
    }

    // Spawn pipes
    this.nextPipeDistance -= scrollSpeed;
    if (this.nextPipeDistance <= 0) {
      this.spawnPipe(settings);
      this.nextPipeDistance = this.getPipeSpacing(settings);
    }

    // Update pipes
    const now = performance.now();
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= scrollSpeed;

      // Handle vertical bobbing pattern
      if (settings.pattern === 'VERTICAL_BOB') {
        p.bobPhase += 0.035;
        const bobOffset = Math.sin(p.bobPhase) * 28;
        p.topHeight = Math.max(40, p.baseY + bobOffset);
        p.bottomY = p.topHeight + p.gap;
        p.bottomHeight = this.groundY - p.bottomY;
      }

      // Check score
      if (!p.passed && p.x + p.width < this.bird.x) {
        p.passed = true;
        this.score++;
        this.combo++;
        onScorePoint();
      }

      // Check collision with bird (circle vs box with forgiving 82% margin)
      const hitMargin = this.bird.radius * 0.82;
      const birdLeft = this.bird.x - hitMargin;
      const birdRight = this.bird.x + hitMargin;
      const birdTop = this.bird.y - hitMargin;
      const birdBottom = this.bird.y + hitMargin;

      const pipeLeft = p.x;
      const pipeRight = p.x + p.width;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Horizontal overlap, check vertical
        if (birdTop < p.topHeight || birdBottom > p.bottomY) {
          this.bird.alive = false;
          onCrash();
          return;
        }
      }

      // Despawn offscreen
      if (p.x + p.width < -40) {
        this.pipes.splice(i, 1);
      }
    }

    // Update coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.x -= scrollSpeed;
      c.bobPhase += 0.06;
      c.y = c.baseY + Math.sin(c.bobPhase) * 6;

      // Check feather collection
      if (!c.collected) {
        const dx = this.bird.x - c.x;
        const dy = this.bird.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.bird.radius + c.radius + 6) {
          c.collected = true;
          this.feathersCollectedInRun++;
          onCollectCoin();

          // Collect sparkle burst
          for (let k = 0; k < 8; k++) {
            this.particles.push({
              x: c.x,
              y: c.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 1.0,
              maxLife: 25,
              color: '#facc15',
              size: 3 + Math.random() * 3,
              type: 'gold'
            });
          }
        }
      }

      // Despawn
      if (c.x < -30 || c.collected) {
        this.coins.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 1 / pt.maxLife;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}
