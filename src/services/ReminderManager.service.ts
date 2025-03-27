import { Injectable } from '@angular/core';
import { DataProvider } from 'src/app/interfaces/DataProvider';
import { Reminder } from 'src/app/model/Reminder';
import { LocalStorageProvider } from 'src/app/providers/LocalStorageProvider';

@Injectable({
  providedIn: 'root'
})
export class ReminderManagerService {

  DataProvider: DataProvider = new LocalStorageProvider();
  reminders: Reminder[] = [];

  constructor() { }

  addReminder(reminder: Reminder) {
    this.DataProvider.addReminder(reminder).then(wasAdded => {
      if (wasAdded) this.reminders.push(reminder);
    });
  }

  async getReminders() {
    if (this.reminders.length === 0) await this.DataProvider.getReminders()


    return this.reminders;
  }

  deleteReminder(reminder: Reminder) {
    if (this.reminders.length === 0) return;

    this.DataProvider.deleteReminder(reminder).then(wasDeleted => {
      if (wasDeleted) this.reminders = this.reminders.filter(r => r.id !== reminder.id);
    });
  }

  updateReminder(reminder: Reminder) {
    if (this.reminders.length === 0) return;

    this.DataProvider.addReminder(reminder).then(wasUpdated => {
      if (wasUpdated) this.reminders = this.reminders.map(r => r.id === reminder.id ? reminder : r);
    });
  }

}
