import React, { useState } from 'react';
import { Share2, Download, Copy, Check, Twitter, Facebook, MessageCircle, X } from 'lucide-react';
import { ScorecardCanvas } from './ScorecardCanvas';
import { PlayerProfile, ObstacleSettings, SkinId } from '../types/game';

interface ShareModalProps {
  score: number;
  feathersInRun: number;
  profile: PlayerProfile;
  obstacleSettings: ObstacleSettings;
  equippedSkinId: SkinId;
  onClose: () => void;
}

export const ShareScoreModal: React.FC<ShareModalProps> = ({
  score,
  feathersInRun,
  profile,
  obstacleSettings,
  equippedSkinId,
  onClose
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const shareText = `I just scored ${score} in AeroFlap Skies dodging ${obstacleSettings.theme.replace('_', ' ')}! Can you beat my record? ✈️⚡`;
  const shareUrl = window.location.href;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `aeroflap-score-${score}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy share text
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        if (imageUrl && navigator.canShare) {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], 'aeroflap-score.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'AeroFlap Skies Score',
              text: shareText,
              files: [file],
              url: shareUrl
            });
            return;
          }
        }
        await navigator.share({
          title: 'AeroFlap Skies Score',
          text: shareText,
          url: shareUrl
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyImage();
    }
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Share Your Flight</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>High-Res Telemetry Card</span>
              <span aria-hidden="true">·</span>
              <span>Instagram & X Ready</span>
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

        {/* Generated Canvas Preview */}
        <div className="mt-4">
          <ScorecardCanvas
            score={score}
            feathersInRun={feathersInRun}
            profile={profile}
            obstacleSettings={obstacleSettings}
            equippedSkinId={equippedSkinId}
            onImageGenerated={setImageUrl}
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium text-sm transition-transform active:scale-[0.98] shadow-lg shadow-sky-500/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Sheet</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>

        {/* Quick Social Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Direct Social Post</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTwitterShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>Post to X</span>
            </button>
            <button
              onClick={handleFacebookShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-500" />
              <span>Facebook</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Copy to clipboard */}
        <button
          onClick={handleCopyImage}
          className="mt-3 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors border border-slate-800"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Card Copied to Clipboard!' : 'Copy Card Image to Clipboard'}</span>
        </button>
      </div>
    </div>
  );
};
