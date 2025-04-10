import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Notification } from '../models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  async requestPermissions(): Promise<number> {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted' ? 1 : -1;
  }

  async scheduleNotification(notification: Notification): Promise<boolean> {
    const { title, body, scheduleTime } = notification;

    if (!title.trim() || !body.trim() || !scheduleTime.trim()) {
      return false;
    }

    const scheduledDate = new Date(scheduleTime);

    await LocalNotifications.schedule({
      notifications: [{
        id: notification.id || (Date.now() % 2147483647),
        title,
        body,
        schedule: { at: scheduledDate },
      }]
    });

    return true;
  }
}
