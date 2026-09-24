/**
 * Push Notification System
 * Integrates Web Notifications API + In-App Notification Center
 */
import { AppNotification, UserPreferences } from '../types/game';

const NOTIFICATIONS_STORAGE_KEY = 'aeroflap_notifications_log_v2';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to AeroFlap Skies! ✈️',
    body: 'Take off on your first flight and earn 150 Star Feathers bonus.',
    timestamp: '1h ago',
    category: 'achievement',
    read: false
  },
  {
    id: 'notif_daily',
    title: 'Daily Challenge Ready! 🎯',
    body: 'Pass 15 obstacles in a single flight to claim 35 Star Feathers.',
    timestamp: '2h ago',
    category: 'daily',
    read: false
  },
  {
    id: 'notif_season',
    title: 'Season 1: Neon Skies Active ⚡',
    body: 'Compete for the exclusive Celestial Saucer skin this week!',
    timestamp: '5h ago',
    category: 'season',
    read: true
  }
];

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }
  return 'denied';
}

export function triggerPushNotification(
  title: string,
  body: string,
  category: AppNotification['category'],
  preferences: UserPreferences
): AppNotification | null {
  // Check category preferences
  if (category === 'daily' && !preferences.notifications.dailyChallenges) return null;
  if (category === 'leaderboard' && !preferences.notifications.leaderboardUpdates) return null;
  if (category === 'season' && !preferences.notifications.seasonalEvents) return null;
  if (category === 'achievement' && !preferences.notifications.achievementReminders) return null;

  const newNotif: AppNotification = {
    id: 'notif_' + Date.now(),
    title,
    body,
    timestamp: 'Just now',
    category,
    read: false
  };

  // 1. Try real browser Web Notification API
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } catch {
      // fallback
    }
  }

  // 2. Persist to in-app notification center
  const current = loadNotifications();
  const updated = [newNotif, ...current.slice(0, 24)];
  saveNotifications(updated);

  return newNotif;
}
