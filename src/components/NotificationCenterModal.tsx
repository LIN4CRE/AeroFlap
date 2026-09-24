import React, { useState } from 'react';
import { Bell, Check, Trash2, Send, X, ShieldAlert, Award, Target, Trophy, Sparkles } from 'lucide-react';
import { AppNotification, UserPreferences } from '../types/game';
import { requestPushPermission, triggerPushNotification } from '../utils/notifications';
import { soundFx } from '../utils/audio';

interface NotificationModalProps {
  notifications: AppNotification[];
  preferences: UserPreferences;
  onClearNotifications: () => void;
  onMarkAllAsRead: () => void;
  onAddNotification: (notif: AppNotification) => void;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationModalProps> = ({
  notifications,
  preferences,
  onClearNotifications,
  onMarkAllAsRead,
  onAddNotification,
  onClose
}) => {
  const [permissionState, setPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    setPermissionState(res);
    if (res === 'granted') {
      soundFx.playFanfare();
      const n = triggerPushNotification(
        'Push Alerts Activated! 🚀',
        'You will receive instant alerts for leaderboard shifts & daily challenges.',
        'achievement',
        preferences
      );
      if (n) onAddNotification(n);
    }
  };

  const handleSendTestNotification = () => {
    const scenarios = [
      {
        title: 'Leaderboard Rival Alert! 🏆',
        body: 'ApexFalcon scored 118 and took Rank #2 on the Global Circuit!',
        category: 'leaderboard' as const
      },
      {
        title: 'Daily Flight Mission Ready! 🎯',
        body: 'Complete 3 flights today to claim 25 Star Feathers.',
        category: 'daily' as const
      },
      {
        title: 'Season 1 Grand Prix Milestone ⚡',
        body: 'Double Season XP is now active for Cyber Laser courses!',
        category: 'season' as const
      }
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    soundFx.playCoin();
    const notif = triggerPushNotification(pick.title, pick.body, pick.category, preferences);
    if (notif) {
      onAddNotification(notif);
    }
  };

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'leaderboard':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'daily':
        return <Target className="w-4 h-4 text-sky-400" />;
      case 'season':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'achievement':
      default:
        return <Award className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-400" />
              <span>Broadcast Terminal</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Real-Time Push Alerts</span>
              <span aria-hidden="true">·</span>
              <span>Match & Leaderboard Feeds</span>
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

        {/* Browser Permission Banner */}
        {permissionState !== 'granted' && permissionState !== 'unsupported' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-amber-200 block">Enable Device Push</span>
                <span className="text-amber-400/80">Receive alerts even when app is minimized</span>
              </div>
            </div>
            <button
              onClick={handleEnablePush}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl shadow transition-colors shrink-0"
            >
              Grant
            </button>
          </div>
        )}

        {/* Toolbar actions */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <button
            onClick={handleSendTestNotification}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulate Live Push</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Mark Read
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={onClearNotifications}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No recent notifications in queue.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-slate-800/30 border-slate-800/70 text-slate-400'
                    : 'bg-slate-800/70 border-sky-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    {getCategoryIcon(n.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono-nums">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
