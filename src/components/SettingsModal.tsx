import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Vibrate,
  Lock,
  Download,
  Upload,
  Bell,
  Eye,
  X,
  FileSpreadsheet,
  Check,
  ShieldCheck
} from 'lucide-react';
import {
  UserPreferences,
  AppTheme,
  PlayerProfile,
  ObstacleSettings,
  CharacterSkin,
  DailyQuest
} from '../types/game';
import {
  createEncryptedBackup,
  restoreEncryptedBackup,
  exportFlightSummaryCSV
} from '../utils/storage';
import { soundFx } from '../utils/audio';
import { haptics, HapticType } from '../utils/haptics';

interface SettingsModalProps {
  preferences: UserPreferences;
  profile: PlayerProfile;
  obstacleSettings: ObstacleSettings;
  skins: CharacterSkin[];
  quests: DailyQuest[];
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onRestoreBackup: (data: unknown) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  profile,
  obstacleSettings,
  skins,
  quests,
  onUpdatePreferences,
  onRestoreBackup,
  onClose
}) => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [exportStatus, setExportStatus] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');

  const themes: Array<{ id: AppTheme; name: string; desc: string; icon: typeof Moon }> = [
    { id: 'dark_cyber', name: 'Cyber Midnight', desc: 'Deep navy with glowing neon', icon: Moon },
    { id: 'daylight', name: 'Daylight Sky', desc: 'Vibrant azure with fluffy clouds', icon: Sun },
    { id: 'sunset', name: 'Sunset Horizon', desc: 'Warm violet & amber dusk', icon: Sun },
    { id: 'retro_amber', name: 'CRT Arcade', desc: '1984 amber phosphor aesthetic', icon: Moon }
  ];

  const handleExportJSON = async () => {
    try {
      setExportStatus('Encrypting vault with AES-GCM...');
      const encryptedBase64 = await createEncryptedBackup(
        profile,
        obstacleSettings,
        skins,
        quests,
        preferences,
        passphrase.trim() || undefined
      );

      const blob = new Blob([encryptedBase64], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aeroflap-cloud-backup-${profile.username}.aeroflap`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('Encrypted backup successfully downloaded!');
      soundFx.playCoin();
      setTimeout(() => setExportStatus(''), 4000);
    } catch {
      setExportStatus('Export encryption failed.');
    }
  };

  const handleExportCSV = () => {
    const csvContent = exportFlightSummaryCSV(profile);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeroflap-flight-log-${profile.username}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    soundFx.playCoin();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Decrypting backup...');
      const text = await file.text();
      const payload = await restoreEncryptedBackup(text.trim(), passphrase.trim() || undefined);
      onRestoreBackup(payload);
      setImportStatus('Backup decrypted & restored successfully!');
      soundFx.playFanfare();
      setTimeout(() => setImportStatus(''), 4000);
    } catch {
      setImportStatus('Decryption failed: Invalid passphrase or corrupted file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-sky-400" />
              <span>Cockpit Settings & Data Vault</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Dark Mode Themes</span>
              <span aria-hidden="true">·</span>
              <span>Encrypted Backups & Controls</span>
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

        {/* Scrollable Settings */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Visual Environment & Dark Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const active = preferences.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onUpdatePreferences({ theme: t.id });
                      soundFx.playClick();
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left border transition-all ${
                      active
                        ? 'bg-slate-800 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0 text-sky-400">
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-100">{t.name}</span>
                        {active && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio & Haptic Feedback */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Audio & Haptic Tactility
            </label>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  {preferences.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-sky-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-500" />
                  )}
                  <div>
                    <span className="font-semibold text-xs text-slate-200 block">Sound Effects</span>
                    <span className="text-[11px] text-slate-500">Synthesized zero-latency chimes</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    onUpdatePreferences({ soundEnabled: enabled });
                    soundFx.setSoundEnabled(enabled);
                  }}
                  className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Vibrate className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="font-semibold text-xs text-slate-200 block">Haptic Feedback</span>
                      <span className="text-[11px] text-slate-500">W3C Vibration API for mobile tactile immersion</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.hapticsEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      onUpdatePreferences({ hapticsEnabled: enabled });
                      haptics.setEnabled(enabled);
                      if (enabled) haptics.trigger('UI_CLICK');
                    }}
                    className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                  />
                </div>

                {preferences.hapticsEnabled && (
                  <div className="pt-2 border-t border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-400">Test Tactile Patterns:</span>
                      <span className="text-[10px] text-slate-500">
                        {haptics.isSupported() ? 'Device API Ready' : 'Desktop Preview'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => haptics.trigger('GAME_START')}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-[11px] font-medium text-sky-300 rounded-lg border border-slate-700 transition-all text-center"
                      >
                        🚀 Game Start
                      </button>
                      <button
                        type="button"
                        onClick={() => haptics.trigger('FEATHER_COLLECT')}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-[11px] font-medium text-amber-300 rounded-lg border border-slate-700 transition-all text-center"
                      >
                        🪶 Feather Collect
                      </button>
                      <button
                        type="button"
                        onClick={() => haptics.trigger('COLLISION')}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-[11px] font-medium text-rose-300 rounded-lg border border-slate-700 transition-all text-center"
                      >
                        💥 Collision
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-xs text-slate-200 block">High Contrast Mode</span>
                    <span className="text-[11px] text-slate-500">Max contrast geometry for outdoor sunlight</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.highContrast}
                  onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                  className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Push Notification Categories */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Push Alert Preferences
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span className="text-xs text-slate-200">Daily Challenges</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.dailyChallenges}
                  onChange={(e) =>
                    onUpdatePreferences({
                      notifications: {
                        ...preferences.notifications,
                        dailyChallenges: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-200">Leaderboard Changes</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.leaderboardUpdates}
                  onChange={(e) =>
                    onUpdatePreferences({
                      notifications: {
                        ...preferences.notifications,
                        leaderboardUpdates: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Encrypted Data Export & Backup */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Encrypted Backup & Data Portability
            </label>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Optional Encryption Passphrase (AES-GCM 256-bit)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret passphrase to encrypt..."
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {exportStatus && (
                <div className="text-xs text-sky-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{exportStatus}</span>
                </div>
              )}

              {importStatus && (
                <div className="text-xs text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore File</span>
                  <input
                    type="file"
                    accept=".aeroflap,.json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-sky-500/20 active:scale-[0.98]"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};
