import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCw, Play, Pause, Compass, Sparkles, Volume2 } from 'lucide-react';
import { CharacterSkin, SkinId } from '../types/game';
import { soundFx } from '../utils/audio';

interface Skin3DPreviewProps {
  skin: CharacterSkin;
  onTestSound?: () => void;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const Skin3DPreview: React.FC<Skin3DPreviewProps> = ({ skin, onTestSound }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [yaw, setYaw] = useState<number>(0.4); // Horizontal rotation in radians
  const [pitch, setPitch] = useState<number>(0.15); // Vertical tilt in radians
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startYaw: number; startPitch: number }>({
    x: 0,
    y: 0,
    startYaw: 0,
    startPitch: 0
  });

  const flapAnimRef = useRef<number>(0);
  const particlesRef = useRef<Particle3D[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Interactive Flap Trigger
  const triggerFlap = useCallback(() => {
    flapAnimRef.current = 1.0;
    soundFx.playFlap(skin.pitchModifier);

    // Burst particles
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.5 + Math.random() * 2;
      particlesRef.current.push({
        x: (Math.random() - 0.5) * 10,
        y: 10 + (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: 1.2 + Math.random() * 2,
        vz: Math.sin(angle) * speed,
        life: 1,
        maxLife: 25 + Math.random() * 15,
        size: 3 + Math.random() * 3,
        color: getParticleColor(skin.particleType)
      });
    }
  }, [skin]);

  function getParticleColor(type: CharacterSkin['particleType']): string {
    switch (type) {
      case 'fire_embers':
        return Math.random() > 0.5 ? '#f97316' : '#ef4444';
      case 'cyber_trail':
        return '#38bdf8';
      case 'gold_stars':
        return '#fbbf24';
      case 'void_runes':
        return '#c084fc';
      case 'retro_pixels':
        return '#22c55e';
      case 'pink_hearts':
        return '#f472b6';
      case 'steam_puff':
        return '#cbd5e1';
      case 'ghost_mist':
        return '#a7f3d0';
      case 'cosmic_rings':
        return '#818cf8';
      case 'feathers':
      default:
        return '#fde047';
    }
  }

  // Pointer drag controls for 3D manual rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startYaw: yaw,
      startPitch: pitch
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setYaw(dragStartRef.current.startYaw + dx * 0.015);
    setPitch(
      Math.max(
        -0.45,
        Math.min(0.55, dragStartRef.current.startPitch + dy * 0.012)
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  // Main 3D Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localYaw = yaw;
    let localPitch = pitch;

    const render = (now: number) => {
      const dt = Math.min(32, now - lastTimeRef.current);
      lastTimeRef.current = now;

      // Update rotation if auto-rotating
      if (isAutoRotating && !isDragging) {
        localYaw += 0.018 * rotationSpeed;
        setYaw(localYaw);
      } else {
        localYaw = yaw;
      }
      localPitch = pitch;

      // Update flap animation decay
      if (flapAnimRef.current > 0) {
        flapAnimRef.current = Math.max(0, flapAnimRef.current - dt * 0.003);
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 8;
      const hoverY = Math.sin(now * 0.003) * 7;

      // Draw background atmospheric glow
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width * 0.6
      );
      bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.2)');
      bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 1. RENDER 3D HOLOGRAPHIC LAUNCH PEDESTAL ---
      const pedestalY = centerY + 58;
      ctx.save();
      ctx.translate(centerX, pedestalY);

      // Pedestal Drop Shadow (scales with altitude)
      const shadowScale = 1 - (hoverY + 7) * 0.02;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 52 * shadowScale, 18 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Holographic concentric rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 68, 24, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner tech spinning ring
      ctx.save();
      ctx.rotate(now * 0.001);
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 17, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Pedestal ticks / radial beacons
      for (let i = 0; i < 4; i++) {
        const ringAngle = (Math.PI / 2) * i + now * 0.0006;
        const beaconX = Math.cos(ringAngle) * 68;
        const beaconY = Math.sin(ringAngle) * 24;
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(beaconX, beaconY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- 2. UPDATE & DRAW 3D PARTICLES ---
      // Emit idle particle from exhaust
      if (Math.random() < 0.35) {
        const exhaustAngle = localYaw + Math.PI; // rear of bird
        const spawnX = Math.cos(exhaustAngle) * 20;
        const spawnZ = Math.sin(exhaustAngle) * 20;
        particlesRef.current.push({
          x: spawnX,
          y: hoverY + 4,
          z: spawnZ,
          vx: Math.cos(exhaustAngle) * (0.8 + Math.random() * 0.6),
          vy: 0.5 + Math.random() * 0.5,
          vz: Math.sin(exhaustAngle) * (0.8 + Math.random() * 0.6),
          life: 1,
          maxLife: 30 + Math.random() * 20,
          size: 2.5 + Math.random() * 2,
          color: getParticleColor(skin.particleType)
        });
      }

      // Draw particles behind bird (z < 0)
      drawParticleLayer(ctx, centerX, centerY, -1);

      // --- 3. RENDER 3D CHARACTER WITH LIGHTING & FORESHORTENING ---
      ctx.save();
      ctx.translate(centerX, centerY + hoverY);

      // Apply Pitch tilt
      ctx.rotate(localPitch * 0.5);

      // 3D Perspective Projection:
      // cos(yaw) controls facing direction and horizontal scale
      // sin(yaw) controls forward/backward depth
      const facingScale = Math.cos(localYaw);
      const depthOffset = Math.sin(localYaw);
      const isFacingRight = facingScale >= 0;
      const absScale = Math.max(0.25, Math.abs(facingScale));

      // Flap cycle calculation
      const baseFlap = Math.sin(now * 0.012);
      const flapStrength = flapAnimRef.current > 0 ? Math.sin(now * 0.05) * 1.5 : baseFlap;

      ctx.save();
      // Pseudo 3D foreshortening matrix
      ctx.scale(facingScale === 0 ? 0.01 : facingScale, 1);

      // Render the specific character skin
      renderCharacterSkin3D(ctx, skin.id, 24, flapStrength, depthOffset);

      ctx.restore();

      // Specular 3D highlight (glides across as model rotates)
      const lightReflectionX = Math.sin(localYaw + 0.8) * 16;
      const lightReflectionAlpha = Math.max(0, Math.cos(localYaw + 0.8) * 0.5);
      if (lightReflectionAlpha > 0.05) {
        const glintGrad = ctx.createRadialGradient(
          lightReflectionX,
          -8,
          0,
          lightReflectionX,
          -8,
          16
        );
        glintGrad.addColorStop(0, `rgba(255, 255, 255, ${lightReflectionAlpha})`);
        glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glintGrad;
        ctx.beginPath();
        ctx.arc(lightReflectionX, -8, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw particles in front of bird (z >= 0)
      drawParticleLayer(ctx, centerX, centerY, 1);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [skin, isAutoRotating, rotationSpeed, yaw, pitch, isDragging]);

  // Helper: Draw particle layer partitioned by depth
  const drawParticleLayer = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    depthSign: number
  ) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.life += 1;

      const progress = p.life / p.maxLife;
      if (progress >= 1) return false;

      // Filter by front/back layer
      if (depthSign < 0 && p.z >= 0) return true;
      if (depthSign > 0 && p.z < 0) return true;

      const alpha = 1 - progress;
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(cx + p.x, cy + p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      return true;
    });
  };

  // Helper: Render Character Skin in 3D
  const renderCharacterSkin3D = (
    ctx: CanvasRenderingContext2D,
    skinId: SkinId,
    r: number,
    flap: number,
    depth: number
  ) => {
    switch (skinId) {
      case 'cyber_drone': {
        // Mecha metallic chassis
        const chassisGrad = ctx.createLinearGradient(-r, -r, r, r);
        chassisGrad.addColorStop(0, '#0369a1');
        chassisGrad.addColorStop(0.5, '#0284c7');
        chassisGrad.addColorStop(1, '#075985');
        ctx.fillStyle = chassisGrad;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(-r * 0.4, -r * 0.8);
        ctx.lineTo(r * 0.8, -r * 0.4);
        ctx.lineTo(r, 0);
        ctx.lineTo(r * 0.7, r * 0.6);
        ctx.lineTo(-r * 0.4, r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Neon Visor
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(4, -6, 12, 5);

        // Ion Thruster Wing
        ctx.fillStyle = '#0284c7';
        ctx.save();
        ctx.translate(-6, 0);
        ctx.rotate(flap * 0.45);
        ctx.fillRect(-10, -5, 20, 9);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-12, -2, 4, 4); // glow node
        ctx.restore();
        break;
      }

      case 'phoenix_flame': {
        // Radiant fire sphere
        const fireGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
        fireGrad.addColorStop(0, '#fef08a');
        fireGrad.addColorStop(0.4, '#f97316');
        fireGrad.addColorStop(1, '#dc2626');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Solar Crest
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(-4, -r);
        ctx.lineTo(2, -r - 10);
        ctx.lineTo(7, -r + 2);
        ctx.fill();

        // Flame Wings
        ctx.fillStyle = '#f97316';
        ctx.save();
        ctx.translate(-4, 0);
        ctx.rotate(flap * 0.55);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.8, r * 0.45, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.arc(9.5, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'golden_monarch': {
        // Royal gold body with luxury luster
        const goldGrad = ctx.createLinearGradient(-r, -r, r, r);
        goldGrad.addColorStop(0, '#fef08a');
        goldGrad.addColorStop(0.5, '#f59e0b');
        goldGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.88, 0, 0, Math.PI * 2);
        ctx.fill();

        // Royal Crown
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-7, -r + 2);
        ctx.lineTo(-9, -r - 10);
        ctx.lineTo(-2, -r - 5);
        ctx.lineTo(3, -r - 12);
        ctx.lineTo(8, -r - 5);
        ctx.lineTo(13, -r - 10);
        ctx.lineTo(10, -r + 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ruby Gems on Crown
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(3, -r - 6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Monarch Wing
        ctx.fillStyle = '#d97706';
        ctx.save();
        ctx.translate(-4, 1);
        ctx.rotate(flap * 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.7, r * 0.42, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Eye & Beak
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(9, -4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(r - 2, -2);
        ctx.lineTo(r + 12, 3);
        ctx.lineTo(r - 2, 8);
        ctx.fill();
        break;
      }

      case 'pixel_arcade': {
        // Retro 8-Bit Pixel Blocks
        const pSize = 4;
        ctx.fillStyle = '#22c55e';
        for (let x = -4; x <= 4; x++) {
          for (let y = -4; y <= 4; y++) {
            if (x * x + y * y <= 16) {
              ctx.fillRect(x * pSize, y * pSize, pSize - 0.5, pSize - 0.5);
            }
          }
        }
        // Pixel Eye
        ctx.fillStyle = '#052e16';
        ctx.fillRect(2 * pSize, -2 * pSize, pSize, pSize);
        // Pixel Beak
        ctx.fillStyle = '#eab308';
        ctx.fillRect(4 * pSize, -1 * pSize, pSize * 2, pSize);
        // Pixel Wing
        ctx.fillStyle = '#16a34a';
        const wingYOffset = Math.round(flap * 2) * pSize;
        ctx.fillRect(-3 * pSize, wingYOffset, 3 * pSize, 2 * pSize);
        break;
      }

      case 'void_raven': {
        // Obsidian & Void Astral gradient
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Astral Void Wing
        ctx.fillStyle = '#4338ca';
        ctx.save();
        ctx.translate(-5, 0);
        ctx.rotate(flap * 0.5);
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(15, -12);
        ctx.lineTo(8, 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Void Rune Eye
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(8, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, -4, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Sharp Raven Beak
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(r - 2, -4);
        ctx.lineTo(r + 14, 2);
        ctx.lineTo(r - 2, 7);
        ctx.fill();
        break;
      }

      case 'steampunk_aviator': {
        // Bronze metal body
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.88, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leather Flight Cap
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(0, -6, r * 0.9, Math.PI, 0);
        ctx.fill();

        // Brass Aviator Goggles
        ctx.fillStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(7, -6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        ctx.fillStyle = '#38bdf8'; // Goggle glass
        ctx.beginPath();
        ctx.arc(7, -6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Brass Gear Wing
        ctx.fillStyle = '#b45309';
        ctx.save();
        ctx.translate(-4, 0);
        ctx.rotate(flap * 0.4);
        ctx.fillRect(-10, -4, 18, 8);
        ctx.restore();
        break;
      }

      case 'ethereal_ghost': {
        // Translucent spectral body
        ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.beginPath();
        ctx.arc(0, -2, r, Math.PI, 0);
        ctx.lineTo(r, r * 0.8);
        ctx.lineTo(r * 0.4, r * 0.4);
        ctx.lineTo(0, r * 0.9);
        ctx.lineTo(-r * 0.4, r * 0.4);
        ctx.lineTo(-r, r * 0.8);
        ctx.closePath();
        ctx.fill();

        // Ghostly glowing eyes
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(6, -4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'kawaii_chick': {
        // Pastel soft yellow
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Pink Blush
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(8, 4, 4, 0, Math.PI * 2);
        ctx.fill();

        // Cute Big Eye
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(8, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(9.5, -6.5, 2, 0, Math.PI * 2);
        ctx.arc(7, -4, 1, 0, Math.PI * 2);
        ctx.fill();

        // Tiny Beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(r + 2, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'cosmic_ufo': {
        // Glass Cockpit Dome
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.beginPath();
        ctx.arc(0, -6, 14, Math.PI, 0);
        ctx.fill();

        // Saucer Metal Hull
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(0, 2, r * 1.3, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsating Hull Beacons
        for (let i = -2; i <= 2; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#e2e8f0';
          ctx.beginPath();
          ctx.arc(i * 9, 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'classic_canary':
      default: {
        // Classic yellow Canary
        const canaryGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, r);
        canaryGrad.addColorStop(0, '#fef08a');
        canaryGrad.addColorStop(0.6, '#fbbf24');
        canaryGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = canaryGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
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
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(9.5, -6, 1, 0, Math.PI * 2);
        ctx.fill();

        // Flapping Wing
        ctx.fillStyle = '#f59e0b';
        ctx.save();
        ctx.translate(-4, 1);
        ctx.rotate(flap * 0.45);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.62, r * 0.4, -0.2, 0, Math.PI * 2);
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
        break;
      }
    }
  };

  const setAnglePreset = (newYaw: number) => {
    setIsAutoRotating(false);
    setYaw(newYaw);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 p-3 shadow-inner relative flex flex-col items-center">
      {/* Top 3D Stage Status Bar */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-1 z-10 px-1">
        <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>3D Turntable Stage</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Drag to orbit 360°
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 transition-colors shadow-sm"
            title={isAutoRotating ? 'Pause Orbit' : 'Resume Auto Orbit'}
            aria-label="Toggle Auto Rotate"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={triggerFlap}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
            title="Test flight flap & wing audio"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Test Flap</span>
          </button>
        </div>
      </div>

      {/* Angle Presets and Speed */}
      <div className="w-full flex items-center justify-between pt-2 px-1 text-[10px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAnglePreset(0)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Side
          </button>
          <button
            onClick={() => setAnglePreset(Math.PI * 0.25)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            3/4 Iso
          </button>
          <button
            onClick={() => setAnglePreset(Math.PI * 0.5)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Front
          </button>
          <button
            onClick={() => setAnglePreset(Math.PI)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Rear
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <RotateCw className="w-3 h-3" />
          <span>{isAutoRotating ? 'Spinning' : 'Free Orbit'}</span>
        </div>
      </div>
    </div>
  );
};
