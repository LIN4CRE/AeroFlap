/**
 * HTML5 Canvas 60fps Game Renderer
 * High-performance, theme-reactive rendering for obstacles, skins, and effects
 */
import { AppTheme, ObstacleSettings, SkinId } from '../types/game';
import { PhysicsEngine, PipePair, StarFeatherItem, Particle } from './physics';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private bgOffset: number = 0;
  private groundOffset: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public render(
    physics: PhysicsEngine,
    theme: AppTheme,
    settings: ObstacleSettings,
    highContrast: boolean
  ) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Scroll offsets
    this.bgOffset = (this.bgOffset + 0.4) % this.width;
    this.groundOffset = (this.groundOffset + 2.2) % 40;

    // 1. Draw Background
    this.drawBackground(theme, highContrast);

    // 2. Draw Obstacles
    for (const pipe of physics.pipes) {
      this.drawObstacle(pipe, settings, highContrast);
    }

    // 3. Draw Collectibles (Star Feathers)
    for (const coin of physics.coins) {
      this.drawFeatherCoin(coin);
    }

    // 4. Draw Particles
    this.drawParticles(physics.particles);

    // 5. Draw Ground
    this.drawGround(theme, physics.groundY, highContrast);

    // 6. Draw Player Character Skin
    this.drawBird(physics.bird, highContrast);
  }

  private drawBackground(theme: AppTheme, highContrast: boolean) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    if (highContrast) {
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, w, h);
      return;
    }

    if (theme === 'dark_cyber') {
      // Midnight Cyber Sky
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#040714');
      grad.addColorStop(0.5, '#0c1733');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant cyber grid & stars
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      for (let i = 0; i < 25; i++) {
        const sx = ((i * 47 + this.bgOffset * 0.2) % w);
        const sy = (i * 23) % (h * 0.55);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Distant City Skyline Silhouettes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      for (let i = 0; i < 12; i++) {
        const bx = ((i * 70 - this.bgOffset * 0.5) % (w + 100)) - 50;
        const bHeight = 70 + (i % 5) * 35;
        const bWidth = 55;
        ctx.fillRect(bx, h - 70 - bHeight, bWidth, bHeight);

        // Windows
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 114, 182, 0.4)';
        for (let wy = h - 70 - bHeight + 10; wy < h - 85; wy += 14) {
          ctx.fillRect(bx + 12, wy, 4, 6);
          ctx.fillRect(bx + 32, wy, 4, 6);
        }
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      }
    } else if (theme === 'sunset') {
      // Sunset Sky
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#311042');
      grad.addColorStop(0.35, '#831843');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, '#fde047');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Warm Sun
      const sunGrad = ctx.createRadialGradient(w * 0.75, h * 0.42, 10, w * 0.75, h * 0.42, 85);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.35)');
      sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.42, 85, 0, Math.PI * 2);
      ctx.fill();

      // Distant clouds
      this.drawCloud(w * 0.2 - this.bgOffset * 0.3, h * 0.32, 60, 'rgba(255, 255, 255, 0.15)');
      this.drawCloud(w * 0.8 - this.bgOffset * 0.3, h * 0.22, 80, 'rgba(255, 255, 255, 0.18)');
    } else if (theme === 'retro_amber') {
      // CRT Amber Arcade
      ctx.fillStyle = '#0f0b04';
      ctx.fillRect(0, 0, w, h);

      // CRT Scanlines
      ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 2);
      }

      // Vector grid lines
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h - 70);
        ctx.stroke();
      }
    } else {
      // Daylight Sky
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.65, '#93c5fd');
      grad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fluffy clouds
      this.drawCloud(w * 0.25 - this.bgOffset * 0.4, h * 0.18, 70, '#ffffff');
      this.drawCloud(w * 0.85 - this.bgOffset * 0.4, h * 0.28, 90, '#ffffff');
      this.drawCloud(w * 0.55 - this.bgOffset * 0.2, h * 0.42, 60, 'rgba(255, 255, 255, 0.8)');
    }
  }

  private drawCloud(x: number, y: number, r: number, color: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.arc(x + r * 0.35, y - r * 0.15, r * 0.5, 0, Math.PI * 2);
    ctx.arc(x + r * 0.75, y, r * 0.4, 0, Math.PI * 2);
    ctx.arc(x + r * 0.4, y + r * 0.1, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawGround(theme: AppTheme, groundY: number, highContrast: boolean) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const groundH = h - groundY;

    if (highContrast) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, groundY, w, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundY + 4, w, groundH);
      return;
    }

    if (theme === 'dark_cyber') {
      // Cyber runway
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, groundY, w, groundH);

      // Top glowing laser strip
      const neonGrad = ctx.createLinearGradient(0, groundY, w, groundY);
      neonGrad.addColorStop(0, '#06b6d4');
      neonGrad.addColorStop(0.5, '#ec4899');
      neonGrad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = neonGrad;
      ctx.fillRect(0, groundY, w, 4);

      // Cyber floor grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      for (let x = -this.groundOffset; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 4);
        ctx.lineTo(x - 20, h);
        ctx.stroke();
      }
    } else if (theme === 'sunset') {
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, groundY, w, groundH);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, groundY, w, 4);
    } else if (theme === 'retro_amber') {
      ctx.fillStyle = '#181206';
      ctx.fillRect(0, groundY, w, groundH);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, groundY, w, 3);
    } else {
      // Classic grass
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, groundY, w, 14);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, groundY + 14, w, 4);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, groundY + 18, w, groundH);
    }
  }

  private drawObstacle(pipe: PipePair, settings: ObstacleSettings, highContrast: boolean) {
    const ctx = this.ctx;
    const { x, width, topHeight, bottomY, bottomHeight } = pipe;
    const theme = settings.theme;

    if (highContrast) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.fillRect(x, 0, width, topHeight);
      ctx.strokeRect(x, 0, width, topHeight);
      ctx.fillRect(x, bottomY, width, bottomHeight);
      ctx.strokeRect(x, bottomY, width, bottomHeight);
      return;
    }

    switch (theme) {
      case 'CYBER_LASER':
        this.drawCyberLaserObstacle(x, width, topHeight, bottomY, bottomHeight, settings.glowEffect);
        break;
      case 'STEAMPUNK_SPIRES':
        this.drawSteampunkObstacle(x, width, topHeight, bottomY, bottomHeight);
        break;
      case 'PIXEL_BRICKS':
        this.drawPixelBrickObstacle(x, width, topHeight, bottomY, bottomHeight);
        break;
      case 'CRYSTAL_SHARDS':
        this.drawCrystalObstacle(x, width, topHeight, bottomY, bottomHeight, settings.glowEffect);
        break;
      case 'CANDY_CANES':
        this.drawCandyObstacle(x, width, topHeight, bottomY, bottomHeight);
        break;
      case 'DARK_NEBULA':
        this.drawNebulaObstacle(x, width, topHeight, bottomY, bottomHeight);
        break;
      case 'CLASSIC_PIPES':
      default:
        this.drawClassicPipe(x, width, topHeight, bottomY, bottomHeight);
        break;
    }
  }

  private drawClassicPipe(x: number, w: number, topH: number, botY: number, botH: number) {
    const ctx = this.ctx;
    const lipH = 24;
    const lipW = w + 8;
    const lipX = x - 4;

    const makePipeGrad = (pipeX: number, pipeW: number) => {
      const grad = ctx.createLinearGradient(pipeX, 0, pipeX + pipeW, 0);
      grad.addColorStop(0, '#15803d');
      grad.addColorStop(0.25, '#4ade80');
      grad.addColorStop(0.65, '#22c55e');
      grad.addColorStop(1, '#14532d');
      return grad;
    };

    // Top Pipe Body
    ctx.fillStyle = makePipeGrad(x, w);
    ctx.fillRect(x, 0, w, topH - lipH);
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, -2, w, topH - lipH + 2);

    // Top Pipe Lip
    ctx.fillStyle = makePipeGrad(lipX, lipW);
    ctx.fillRect(lipX, topH - lipH, lipW, lipH);
    ctx.strokeRect(lipX, topH - lipH, lipW, lipH);

    // Bottom Pipe Lip
    ctx.fillStyle = makePipeGrad(lipX, lipW);
    ctx.fillRect(lipX, botY, lipW, lipH);
    ctx.strokeRect(lipX, botY, lipW, lipH);

    // Bottom Pipe Body
    ctx.fillStyle = makePipeGrad(x, w);
    ctx.fillRect(x, botY + lipH, w, botH);
    ctx.strokeRect(x, botY + lipH, w, botH);
  }

  private drawCyberLaserObstacle(
    x: number,
    w: number,
    topH: number,
    botY: number,
    botH: number,
    glow: boolean
  ) {
    const ctx = this.ctx;
    ctx.save();

    if (glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';
    }

    // Top Tower
    const topGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    topGrad.addColorStop(0, '#0f172a');
    topGrad.addColorStop(0.4, '#1e293b');
    topGrad.addColorStop(1, '#020617');
    ctx.fillStyle = topGrad;
    ctx.fillRect(x, 0, w, topH);

    // Neon edges
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, 0, w, topH);

    // Bottom Tower
    ctx.fillStyle = topGrad;
    ctx.fillRect(x, botY, w, botH);
    ctx.strokeStyle = '#ec4899';
    ctx.strokeRect(x, botY, w, botH);

    // Plasma Emitter Nodes at the gap tips
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 4, topH - 10, w - 8, 10);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(x + 4, botY, w - 8, 10);

    // Energy Laser Guide Beam (thin animated faint beam)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, topH);
    ctx.lineTo(x + w * 0.5, botY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  private drawSteampunkObstacle(x: number, w: number, topH: number, botY: number, botH: number) {
    const ctx = this.ctx;
    const makeBrassGrad = (pipeX: number, pipeW: number) => {
      const grad = ctx.createLinearGradient(pipeX, 0, pipeX + pipeW, 0);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.3, '#d97706');
      grad.addColorStop(0.7, '#b45309');
      grad.addColorStop(1, '#451a03');
      return grad;
    };

    // Top
    ctx.fillStyle = makeBrassGrad(x, w);
    ctx.fillRect(x, 0, w, topH);
    ctx.strokeStyle = '#291102';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, w, topH);

    // Bottom
    ctx.fillStyle = makeBrassGrad(x, w);
    ctx.fillRect(x, botY, w, botH);
    ctx.strokeRect(x, botY, w, botH);

    // Clockwork Gear Accents
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x + w * 0.5, topH - 12, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + w * 0.5, botY + 12, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  private drawPixelBrickObstacle(x: number, w: number, topH: number, botY: number, botH: number) {
    const ctx = this.ctx;
    const brickH = 14;
    const brickW = 20;

    // Top bricks
    for (let y = 0; y < topH; y += brickH) {
      for (let bx = x; bx < x + w; bx += brickW) {
        ctx.fillStyle = ((bx + y) % 3 === 0) ? '#b91c1c' : '#dc2626';
        ctx.fillRect(bx, y, Math.min(brickW - 2, x + w - bx), Math.min(brickH - 2, topH - y));
      }
    }

    // Bottom bricks
    for (let y = botY; y < botY + botH; y += brickH) {
      for (let bx = x; bx < x + w; bx += brickW) {
        ctx.fillStyle = ((bx + y) % 3 === 0) ? '#b91c1c' : '#dc2626';
        ctx.fillRect(bx, y, Math.min(brickW - 2, x + w - bx), brickH - 2);
      }
    }
  }

  private drawCrystalObstacle(
    x: number,
    w: number,
    topH: number,
    botY: number,
    botH: number,
    glow: boolean
  ) {
    const ctx = this.ctx;
    ctx.save();
    if (glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c084fc';
    }

    // Top crystal
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + w, 0);
    ctx.lineTo(x + w, topH - 20);
    ctx.lineTo(x + w * 0.5, topH);
    ctx.lineTo(x, topH - 20);
    ctx.closePath();
    ctx.fill();

    // Bottom crystal
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, botY);
    ctx.lineTo(x + w, botY + 20);
    ctx.lineTo(x + w, botY + botH);
    ctx.lineTo(x, botY + botH);
    ctx.lineTo(x, botY + 20);
    ctx.closePath();
    ctx.fill();

    // Crystal highlights
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, 0);
    ctx.lineTo(x + w * 0.5, topH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, botY);
    ctx.lineTo(x + w * 0.5, botY + botH);
    ctx.stroke();

    ctx.restore();
  }

  private drawCandyObstacle(x: number, w: number, topH: number, botY: number, botH: number) {
    const ctx = this.ctx;
    // Top
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, 0, w, topH);
    // Red stripes
    ctx.fillStyle = '#ef4444';
    for (let y = -20; y < topH + 20; y += 22) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + 18);
      ctx.lineTo(x + w, y + 28);
      ctx.lineTo(x, y + 10);
      ctx.fill();
    }

    // Bottom
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, botY, w, botH);
    ctx.fillStyle = '#ef4444';
    for (let y = botY - 20; y < botY + botH + 20; y += 22) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + 18);
      ctx.lineTo(x + w, y + 28);
      ctx.lineTo(x, y + 10);
      ctx.fill();
    }
  }

  private drawNebulaObstacle(x: number, w: number, topH: number, botY: number, botH: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, 0, w, topH);
    ctx.fillRect(x, botY, w, botH);

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, w, topH);
    ctx.strokeRect(x, botY, w, botH);

    // Glowing rune
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(x + w * 0.5, topH - 16, 6, 0, Math.PI * 2);
    ctx.arc(x + w * 0.5, botY + 16, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawFeatherCoin(coin: StarFeatherItem) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(coin.x, coin.y);

    // Outer glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#eab308';

    // Golden Coin disc
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner rim
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius - 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Star / Feather symbol inside
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(2, -2);
    ctx.lineTo(6, 0);
    ctx.lineTo(2, 2);
    ctx.lineTo(0, 6);
    ctx.lineTo(-2, 2);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-2, -2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      if (p.type === 'heart') {
        ctx.beginPath();
        const s = p.size;
        ctx.arc(p.x - s * 0.3, p.y, s * 0.3, 0, Math.PI * 2);
        ctx.arc(p.x + s * 0.3, p.y, s * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'pixel') {
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawBird(bird: PhysicsEngine['bird'], highContrast: boolean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    const r = bird.radius;
    const flapCycle = Math.sin((Date.now() - bird.flapTime) * 0.02);

    if (highContrast) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(r - 2, -2);
      ctx.lineTo(r + 12, 3);
      ctx.lineTo(r - 2, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      return;
    }

    switch (bird.skinId) {
      case 'cyber_drone':
        this.renderCyberDroneSkin(r, flapCycle);
        break;
      case 'phoenix_flame':
        this.renderPhoenixSkin(r, flapCycle);
        break;
      case 'golden_monarch':
        this.renderGoldenMonarchSkin(r, flapCycle);
        break;
      case 'pixel_arcade':
        this.renderPixelSkin(r);
        break;
      case 'void_raven':
        this.renderVoidRavenSkin(r, flapCycle);
        break;
      case 'steampunk_aviator':
        this.renderSteampunkSkin(r, flapCycle);
        break;
      case 'ethereal_ghost':
        this.renderGhostSkin(r);
        break;
      case 'kawaii_chick':
        this.renderKawaiiSkin(r, flapCycle);
        break;
      case 'cosmic_ufo':
        this.renderUFOSkin(r);
        break;
      case 'classic_canary':
      default:
        this.renderClassicCanary(r, flapCycle);
        break;
    }

    ctx.restore();
  }

  private renderClassicCanary(r: number, flapCycle: number) {
    const ctx = this.ctx;
    // Body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly highlight
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(2, 4, r * 0.65, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7, -5, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(8.5, -5, 2.8, 0, Math.PI * 2);
    ctx.fill();
    // Catchlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(9.5, -6, 1, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#f59e0b';
    ctx.save();
    ctx.translate(-4, 1);
    ctx.rotate(flapCycle * 0.45);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.6, r * 0.38, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Beak
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(r - 3, -3);
    ctx.lineTo(r + 11, 2);
    ctx.lineTo(r - 3, 7);
    ctx.closePath();
    ctx.fill();
  }

  private renderCyberDroneSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    // Mecha Chassis
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(-r * 0.4, -r * 0.8);
    ctx.lineTo(r * 0.8, -r * 0.4);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.7, r * 0.6);
    ctx.lineTo(-r * 0.4, r * 0.7);
    ctx.closePath();
    ctx.fill();

    // Neon Cyber Visor
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(4, -6, 10, 5);

    // Ion Thruster Wing
    ctx.fillStyle = '#0369a1';
    ctx.save();
    ctx.translate(-5, 0);
    ctx.rotate(flapCycle * 0.4);
    ctx.fillRect(-8, -4, 16, 7);
    ctx.restore();
  }

  private renderPhoenixSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    // Fiery body
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Solar Crest
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-4, -r);
    ctx.lineTo(2, -r - 8);
    ctx.lineTo(6, -r + 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(7.5, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Flaming wing
    ctx.fillStyle = '#ea580c';
    ctx.save();
    ctx.translate(-4, 0);
    ctx.rotate(flapCycle * 0.5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -8);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Beak
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(r - 2, -3);
    ctx.lineTo(r + 10, 2);
    ctx.lineTo(r - 2, 6);
    ctx.fill();
  }

  private renderGoldenMonarchSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    // 24k Gold body
    const goldGrad = ctx.createLinearGradient(-r, -r, r, r);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.4, '#facc15');
    goldGrad.addColorStop(0.8, '#ca8a04');
    goldGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Royal Crown
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, -r + 1);
    ctx.lineTo(-8, -r - 7);
    ctx.lineTo(-2, -r - 4);
    ctx.lineTo(2, -r - 9);
    ctx.lineTo(6, -r - 4);
    ctx.lineTo(10, -r - 7);
    ctx.lineTo(8, -r + 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Diamond glint eye
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(7, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Gold Wing
    ctx.fillStyle = '#eab308';
    ctx.save();
    ctx.translate(-3, 0);
    ctx.rotate(flapCycle * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.65, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Golden Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(r - 2, -3);
    ctx.lineTo(r + 9, 2);
    ctx.lineTo(r - 2, 6);
    ctx.fill();
  }

  private renderPixelSkin(r: number) {
    const ctx = this.ctx;
    const px = 3;
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-r, -r * 0.6, r * 2, r * 1.3);

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px, -r * 0.4, px * 2, px * 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(px + 2, -r * 0.4, px, px * 2);

    // Beak
    ctx.fillStyle = '#f97316';
    ctx.fillRect(r, -2, px * 3, px * 2);
  }

  private renderVoidRavenSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Void eye
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(6, -4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Void wing
    ctx.fillStyle = '#4c1d95';
    ctx.save();
    ctx.translate(-4, 0);
    ctx.rotate(flapCycle * 0.45);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.6, r * 0.35, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Beak
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(r - 2, -2);
    ctx.lineTo(r + 11, 2);
    ctx.lineTo(r - 2, 5);
    ctx.fill();
  }

  private renderSteampunkSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Aviator Goggles
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(6, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(6, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Brass wing
    ctx.fillStyle = '#b45309';
    ctx.save();
    ctx.translate(-4, 0);
    ctx.rotate(flapCycle * 0.4);
    ctx.fillRect(-8, -4, 14, 8);
    ctx.restore();

    // Beak
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(r - 2, -2);
    ctx.lineTo(r + 9, 2);
    ctx.lineTo(r - 2, 6);
    ctx.fill();
  }

  private renderGhostSkin(r: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -2, r, Math.PI, 0, false);
    ctx.lineTo(r, r);
    ctx.lineTo(r * 0.3, r * 0.6);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.3, r * 0.6);
    ctx.lineTo(-r, r);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(5, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private renderKawaiiSkin(r: number, flapCycle: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(5, 2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Anime eye
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(6, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7.5, -5.5, 1.8, 0, Math.PI * 2);
    ctx.arc(5, -3, 1, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#f472b6';
    ctx.save();
    ctx.translate(-4, 0);
    ctx.rotate(flapCycle * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.5, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Tiny orange beak
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.moveTo(r - 2, -2);
    ctx.lineTo(r + 6, 1);
    ctx.lineTo(r - 2, 4);
    ctx.fill();
  }

  private renderUFOSkin(r: number) {
    const ctx = this.ctx;
    // Glass dome
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.beginPath();
    ctx.arc(0, -3, r * 0.6, Math.PI, 0);
    ctx.fill();

    // Saucer Disc
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(0, 2, r * 1.15, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neon indicator lights
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(-8, 3, 2, 0, Math.PI * 2);
    ctx.arc(0, 4, 2, 0, Math.PI * 2);
    ctx.arc(8, 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
