import React, { useEffect, useRef } from 'react';
import { PlayerProfile, ObstacleSettings, SkinId } from '../types/game';

interface ScorecardProps {
  score: number;
  feathersInRun: number;
  profile: PlayerProfile;
  obstacleSettings: ObstacleSettings;
  equippedSkinId: SkinId;
  onImageGenerated?: (dataUrl: string) => void;
}

export const ScorecardCanvas: React.FC<ScorecardProps> = ({
  score,
  feathersInRun,
  profile,
  obstacleSettings,
  equippedSkinId,
  onImageGenerated
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed canvas size for high-res social media card (1080x1350 for stories / 1200x675 for feeds)
    const w = 800;
    const h = 500;
    canvas.width = w;
    canvas.height = h;

    // 1. Dark Cyber Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle neon border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Glowing corner accents
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(10, 10, 24, 6);
    ctx.fillRect(10, 10, 6, 24);
    ctx.fillRect(w - 34, 10, 24, 6);
    ctx.fillRect(w - 16, 10, 6, 24);
    ctx.fillRect(10, h - 16, 24, 6);
    ctx.fillRect(10, h - 34, 6, 24);
    ctx.fillRect(w - 34, h - 16, 24, 6);
    ctx.fillRect(w - 16, h - 34, 6, 24);

    // 2. Brand Wordmark Header
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText('AEROFLAP: SKIES', 45, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.fillText('OFFICIAL FLIGHT TELEMETRY · GLOBAL CIRCUIT', 45, 84);

    // 3. Central Big Score
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 96px JetBrains Mono, monospace';
    ctx.fillText(score.toString(), 45, 205);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.fillText('OBSTACLES CLEARED', 50, 235);

    // 4. Run Stats Grid (Clean tabular format)
    const statsY = 300;
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillText('STAR FEATHERS', 48, statsY);
    ctx.fillText('PERSONAL BEST', 210, statsY);
    ctx.fillText('OBSTACLE THEME', 380, statsY);
    ctx.fillText('PILOT RANK', 580, statsY);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 26px JetBrains Mono, monospace';
    ctx.fillText('+' + feathersInRun, 48, statsY + 34);

    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(Math.max(profile.highScore, score).toString(), 210, statsY + 34);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText(obstacleSettings.theme.replace('_', ' '), 380, statsY + 32);

    ctx.fillStyle = '#ec4899';
    ctx.fillText(`LVL ${profile.level}`, 580, statsY + 32);

    // 5. Player Identity Banner at Bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(40, 395, w - 80, 68);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 395, w - 80, 68);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Outfit, sans-serif';
    ctx.fillText(profile.username, 65, 435);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`Equipped: ${equippedSkinId.replace('_', ' ')} · Verified Flight Certificate`, 65, 452);

    const nowStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '13px JetBrains Mono, monospace';
    ctx.fillText(nowStr, w - 170, 438);

    if (onImageGenerated) {
      onImageGenerated(canvas.toDataURL('image/png'));
    }
  }, [score, feathersInRun, profile, obstacleSettings, equippedSkinId, onImageGenerated]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto rounded-xl shadow-2xl border border-slate-700/60"
    />
  );
};
