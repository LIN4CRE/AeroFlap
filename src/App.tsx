/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  loadProfile,
  saveProfile,
  loadObstacleSettings,
  saveObstacleSettings,
  loadSkins,
  saveUnlockedSkins,
  loadQuests,
  saveQuests,
  loadPreferences,
  savePreferences,
  getLeaderboard,
  submitLeaderboardScore,
  enqueueOfflineScore,
  flushOfflineQueue,
  DEFAULT_OBSTACLE_SETTINGS,
  DEFAULT_PREFERENCES
} from './utils/storage';
import { INITIAL_SEASON } from './data/quests';
import { loadNotifications, saveNotifications, triggerPushNotification } from './utils/notifications';
import { soundFx } from './utils/audio';
import { haptics } from './utils/haptics';

import {
  PlayerProfile,
  ObstacleSettings,
  CharacterSkin,
  DailyQuest,
  SeasonalEvent,
  UserPreferences,
  LeaderboardEntry,
  AppNotification,
  SkinId,
  CloudSavePayload
} from './types/game';

import { TopNav } from './components/TopNav';
import { BottomTabBar } from './components/BottomTabBar';
import { GameCanvas } from './components/GameCanvas';
import { ObstacleCustomizerModal } from './components/ObstacleCustomizerModal';
import { SkinsLockerModal } from './components/SkinsLockerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { QuestsModal } from './components/QuestsModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthModal } from './components/AuthModal';
import { ShareScoreModal } from './components/ShareScoreModal';

export default function App() {
  // Core game states
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [obstacleSettings, setObstacleSettings] = useState<ObstacleSettings>(loadObstacleSettings);
  const [skins, setSkins] = useState<CharacterSkin[]>(loadSkins);
  const [quests, setQuests] = useState<DailyQuest[]>(loadQuests);
  const [season, setSeason] = useState<SeasonalEvent>(INITIAL_SEASON);
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(getLeaderboard);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Modal display toggles
  const [activeModal, setActiveModal] = useState<
    'obstacles' | 'skins' | 'leaderboard' | 'quests' | 'settings' | 'notifications' | 'auth' | 'share' | null
  >(null);

  // Flight run telemetry for sharing
  const [shareRunData, setShareRunData] = useState<{ score: number; feathers: number }>({
    score: 0,
    feathers: 0
  });

  // Equipped skin object
  const equippedSkin = skins.find((s) => s.id === profile.avatarSkin) || skins[0];

  // Sync sound & haptics settings
  useEffect(() => {
    soundFx.setSoundEnabled(preferences.soundEnabled);
    soundFx.setVolume(preferences.soundVolume);
    haptics.setEnabled(preferences.hapticsEnabled);
  }, [preferences.soundEnabled, preferences.soundVolume, preferences.hapticsEnabled]);

  // Online / Offline listener & sync queue
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const synced = flushOfflineQueue();
      if (synced.count > 0) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            starFeathers: prev.starFeathers + synced.totalFeathers
          };
          saveProfile(updated);
          return updated;
        });

        triggerPushNotification(
          'Offline Data Cloud-Synced! ☁️',
          `Restored connection: ${synced.count} flight records uploaded.`,
          'achievement',
          preferences
        );
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [preferences]);

  // Handle Game Over: update XP, high score, feathers, quests, and leaderboard
  const handleGameOver = useCallback(
    (score: number, feathersEarned: number) => {
      const earnedXP = score * 15 + feathersEarned * 10;
      const isNewHighScore = score > profile.highScore;

      if (isNewHighScore) {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // fallback
        }
      }

      // Update profile
      setProfile((prev) => {
        const newTotalPipes = prev.totalPipesPassed + score;
        const newTotalFeathers = prev.totalFeathersCollected + feathersEarned;
        const newXP = prev.xp + earnedXP;
        const newLevel = 1 + Math.floor(newXP / 300);

        if (newLevel > prev.level) {
          soundFx.playFanfare();
          triggerPushNotification(
            `Pilot Promotion! Level ${newLevel} Reached 🎖️`,
            'New character skins and badges unlocked in your Hangar.',
            'achievement',
            preferences
          );
        }

        const updated: PlayerProfile = {
          ...prev,
          highScore: Math.max(prev.highScore, score),
          totalGames: prev.totalGames + 1,
          totalPipesPassed: newTotalPipes,
          starFeathers: prev.starFeathers + feathersEarned,
          totalFeathersCollected: newTotalFeathers,
          xp: newXP,
          level: newLevel
        };
        saveProfile(updated);
        return updated;
      });

      // Update quests progress
      setQuests((prevQuests) => {
        const updatedQuests = prevQuests.map((q) => {
          if (q.claimed) return q;

          let newCount = q.currentCount;
          if (q.type === 'SCORE_SINGLE') {
            newCount = Math.max(q.currentCount, score);
          } else if (q.type === 'COLLECT_FEATHERS') {
            newCount = q.currentCount + feathersEarned;
          } else if (q.type === 'PLAY_GAMES') {
            newCount = q.currentCount + 1;
          } else if (q.type === 'THEMED_RUN' && obstacleSettings.theme === q.themeReq) {
            newCount = Math.max(q.currentCount, score);
          }

          const isCompleted = newCount >= q.targetCount;
          if (isCompleted && !q.completed) {
            soundFx.playFanfare();
            triggerPushNotification(
              `Quest Completed: ${q.title}! 🎯`,
              `Claim +${q.rewardFeathers} Star Feathers in the Quests tab.`,
              'daily',
              preferences
            );
          }

          return {
            ...q,
            currentCount: newCount,
            completed: isCompleted
          };
        });

        saveQuests(updatedQuests);
        return updatedQuests;
      });

      // Update Leaderboard if online or queue offline
      if (isOnline) {
        const updatedLb = submitLeaderboardScore(profile, score, obstacleSettings.theme);
        setLeaderboard(updatedLb);
      } else {
        enqueueOfflineScore(score, feathersEarned);
      }
    },
    [profile, obstacleSettings.theme, isOnline, preferences]
  );

  // Equip a character skin
  const handleEquipSkin = (skinId: SkinId) => {
    soundFx.playClick();
    setProfile((prev) => {
      const updated = { ...prev, avatarSkin: skinId };
      saveProfile(updated);
      return updated;
    });
  };

  // Unlock skin with star feathers
  const handleUnlockSkin = (skinToUnlock: CharacterSkin) => {
    if (profile.starFeathers < skinToUnlock.costFeathers) return;

    soundFx.playFanfare();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
    } catch {
      // fallback
    }

    setProfile((prev) => {
      const updated = {
        ...prev,
        starFeathers: prev.starFeathers - skinToUnlock.costFeathers,
        avatarSkin: skinToUnlock.id
      };
      saveProfile(updated);
      return updated;
    });

    setSkins((prev) => {
      const updated = prev.map((s) =>
        s.id === skinToUnlock.id
          ? { ...s, unlocked: true, unlockedAt: new Date().toISOString() }
          : s
      );
      saveUnlockedSkins(updated);
      return updated;
    });
  };

  // Claim Daily Quest Reward
  const handleClaimQuest = (questId: string) => {
    setQuests((prev) => {
      const quest = prev.find((q) => q.id === questId);
      if (!quest || quest.claimed) return prev;

      setProfile((p) => {
        const updated = {
          ...p,
          starFeathers: p.starFeathers + quest.rewardFeathers,
          xp: p.xp + quest.rewardXP
        };
        saveProfile(updated);
        return updated;
      });

      const updated = prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q));
      saveQuests(updated);
      return updated;
    });
  };

  // Claim Daily Login Streak
  const handleClaimStreak = () => {
    soundFx.playFanfare();
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        streakDays: prev.streakDays + 1,
        starFeathers: prev.starFeathers + 50,
        lastStreakClaimDate: new Date().toISOString()
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Open Score Sharing modal
  const handleOpenShareModal = (score: number, feathers: number) => {
    setShareRunData({ score, feathers });
    setActiveModal('share');
  };

  // Restore Decrypted Backup
  const handleRestoreBackup = (rawPayload: unknown) => {
    try {
      const payload = rawPayload as CloudSavePayload;
      if (payload.profile) {
        setProfile(payload.profile);
        saveProfile(payload.profile);
      }
      if (payload.obstacleSettings) {
        setObstacleSettings(payload.obstacleSettings);
        saveObstacleSettings(payload.obstacleSettings);
      }
      if (payload.unlockedSkins) {
        setSkins((prev) => {
          const updated = prev.map((s) => ({
            ...s,
            unlocked: s.id === 'classic_canary' || payload.unlockedSkins.includes(s.id)
          }));
          saveUnlockedSkins(updated);
          return updated;
        });
      }
      if (payload.quests) {
        setQuests(payload.quests);
        saveQuests(payload.quests);
      }
      if (payload.preferences) {
        setPreferences(payload.preferences);
        savePreferences(payload.preferences);
      }
    } catch (e) {
      console.error('Failed to restore backup', e);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`h-full w-full flex flex-col bg-slate-950 text-slate-100 ${preferences.theme}`}>
      {/* Top 3-Zone Navigation Header */}
      <TopNav
        profile={profile}
        unreadNotifsCount={unreadNotifsCount}
        isOnline={isOnline}
        onOpenObstacles={() => setActiveModal('obstacles')}
        onOpenSkins={() => setActiveModal('skins')}
        onOpenLeaderboard={() => setActiveModal('leaderboard')}
        onOpenQuests={() => setActiveModal('quests')}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenNotifications={() => setActiveModal('notifications')}
        onOpenAuth={() => setActiveModal('auth')}
      />

      {/* Main 60fps Game Viewport */}
      <main className="flex-1 w-full h-[calc(100%-56px)] md:h-[calc(100%-56px)] pb-14 md:pb-0 relative flex flex-col overflow-hidden">
        <GameCanvas
          profile={profile}
          obstacleSettings={obstacleSettings}
          equippedSkin={equippedSkin}
          preferences={preferences}
          onGameOver={handleGameOver}
          onOpenShareModal={handleOpenShareModal}
          onOpenObstacles={() => setActiveModal('obstacles')}
          onOpenSkins={() => setActiveModal('skins')}
          onOpenLeaderboard={() => setActiveModal('leaderboard')}
        />
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <BottomTabBar
        onOpenPlay={() => setActiveModal(null)}
        onOpenObstacles={() => setActiveModal('obstacles')}
        onOpenSkins={() => setActiveModal('skins')}
        onOpenLeaderboard={() => setActiveModal('leaderboard')}
        onOpenQuests={() => setActiveModal('quests')}
      />

      {/* MODALS */}
      {activeModal === 'obstacles' && (
        <ObstacleCustomizerModal
          settings={obstacleSettings}
          onSave={(newSettings) => {
            setObstacleSettings(newSettings);
            saveObstacleSettings(newSettings);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'skins' && (
        <SkinsLockerModal
          skins={skins}
          profile={profile}
          onEquipSkin={handleEquipSkin}
          onUnlockSkin={handleUnlockSkin}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'leaderboard' && (
        <LeaderboardModal
          entries={leaderboard}
          profile={profile}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'quests' && (
        <QuestsModal
          quests={quests}
          season={season}
          profile={profile}
          onClaimQuest={handleClaimQuest}
          onClaimStreak={handleClaimStreak}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          preferences={preferences}
          profile={profile}
          obstacleSettings={obstacleSettings}
          skins={skins}
          quests={quests}
          onUpdatePreferences={(updated) => {
            const next = { ...preferences, ...updated };
            setPreferences(next);
            savePreferences(next);
          }}
          onRestoreBackup={handleRestoreBackup}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'notifications' && (
        <NotificationCenterModal
          notifications={notifications}
          preferences={preferences}
          onClearNotifications={() => {
            setNotifications([]);
            saveNotifications([]);
          }}
          onMarkAllAsRead={() => {
            const updated = notifications.map((n) => ({ ...n, read: true }));
            setNotifications(updated);
            saveNotifications(updated);
          }}
          onAddNotification={(n) => {
            setNotifications((prev) => [n, ...prev]);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'auth' && (
        <AuthModal
          profile={profile}
          onUpdateProfile={(updated) => {
            setProfile((prev) => {
              const next = { ...prev, ...updated };
              saveProfile(next);
              return next;
            });
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'share' && (
        <ShareScoreModal
          score={shareRunData.score}
          feathersInRun={shareRunData.feathers}
          profile={profile}
          obstacleSettings={obstacleSettings}
          equippedSkinId={equippedSkin.id}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
