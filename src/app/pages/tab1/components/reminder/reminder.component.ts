import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReminderManagerService } from 'src/app/services/ReminderManager.service';
import { Reminder } from 'src/app/models/Reminder';
import { NotificationService } from 'src/app/services/Notification.service';
import { Notification } from 'src/app/models/Notification';

@Component({
  selector: 'app-reminder-monolitico',
  templateUrl: 'reminder.component.html',
  styleUrls: ['reminder.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ReminderComponent implements OnInit {
  reminders: Reminder[] = [];
  swipedReminderId: number | null = null;
  startX = 0;
  showNewReminderModal = false;
  showEditReminderModal = false;

  newReminder!: Reminder;
  editedReminder!: Reminder;
  permissionsGranted = false;

  constructor(
    private readonly reminderManager: ReminderManagerService,
    private readonly notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.requestNotificationPermission();
    this.updateReminderList();
  }

  private async requestNotificationPermission(): Promise<void> {
    const result = await this.notificationService.requestPermissions();
    this.permissionsGranted = result === 1;
  }

  async addReminder(): Promise<void> {
    if (!this.newReminder.title || !this.newReminder.date) return;

    const currentTime = new Date();
    const reminderTime = new Date(this.newReminder.date);

    if (reminderTime.getTime() <= currentTime.getTime()) {
      alert('La fecha y hora de la notificación deben ser posteriores al momento actual.');
      return;
    }

    await this.reminderManager.addReminder(this.newReminder);

    if (this.permissionsGranted) {
      const notification: Notification = {
        id: this.newReminder.id,
        title: this.newReminder.title,
        body: this.newReminder.description || '',
        scheduleTime: this.newReminder.date
      };
      await this.notificationService.scheduleNotification(notification);
    }

    this.updateReminderList();
    this.closeNewReminderModal();
  }

  async updateReminder(): Promise<void> {
    if (!this.editedReminder.title || !this.editedReminder.date) return;

    const currentTime = new Date();
    const reminderTime = new Date(this.editedReminder.date);

    if (reminderTime.getTime() <= currentTime.getTime()) {
      alert('La fecha y hora de la notificación deben ser posteriores al momento actual.');
      return;
    }

    this.editedReminder.periodicity = this.editedReminder.weekly ? 'weekly' : 'none';

    await this.reminderManager.updateReminder(this.editedReminder);
    if (this.permissionsGranted) {
      const notification: Notification = {
        id: this.editedReminder.id,
        title: this.editedReminder.title,
        body: this.editedReminder.description || '',
        scheduleTime: this.editedReminder.date
      };
      await this.notificationService.scheduleNotification(notification);
    }

    this.updateReminderList();
    this.closeEditReminderModal();
  }

  deleteReminder(reminder: Reminder): void {
    this.reminderManager.deleteReminder(reminder);
    this.updateReminderList();
    this.swipedReminderId = null;
  }

  openNewReminderModal(): void {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000;
    this.newReminder = {
      id: this.reminders.length + 1,
      title: '',
      description: '',
      date: new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 16),
      periodicity: 'none',
      weekly: false
    };
    this.showNewReminderModal = true;
  }

  closeNewReminderModal(): void {
    this.showNewReminderModal = false;
  }

  openEditReminder(reminder: Reminder): void {
    if (this.swipedReminderId === reminder.id) return;
    const d = new Date(reminder.date);
    const tzOffsetMs = d.getTimezoneOffset() * 60000;
    this.editedReminder = {
      ...reminder,
      date: new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16)
    };
    this.showEditReminderModal = true;
  }

  closeEditReminderModal(): void {
    this.showEditReminderModal = false;
  }

  startSwipe(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  moveSwipe(event: TouchEvent, reminderId: number): void {
    const currentX = event.touches[0].clientX;
    const deltaX = this.startX - currentX;
    if (deltaX > 50) {
      this.swipedReminderId = reminderId;
    }
  }

  endSwipe(event: TouchEvent): void {
    const endX = event.changedTouches[0].clientX;
    const deltaX = this.startX - endX;
    if (deltaX < 30) {
      this.swipedReminderId = null;
    }
  }

  private updateReminderList(): void {
    this.reminderManager.getReminders().then((reminders: Reminder[]) => {
      this.reminders = reminders;
    });
  }
}