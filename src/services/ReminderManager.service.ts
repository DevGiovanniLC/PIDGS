import { Injectable } from '@angular/core';
import { DataProvider } from 'src/app/interfaces/DataProvider';
import { Reminder } from 'src/app/model/Reminder';
import { LocalStorageProvider } from 'src/app/providers/LocalStorageProvider';

@Injectable({
  providedIn: 'root'
})
export class ReminderManagerService {

  DataProvider: DataProvider

  constructor() {
    this.DataProvider = new LocalStorageProvider();
  }

  addReminder(reminder: Reminder) {
    this.DataProvider.addReminder(reminder)
  }

  async getReminders() {
    return  await this.DataProvider.getReminders();
  }

  deleteReminder(reminder: Reminder) {
    this.DataProvider.deleteReminder(reminder)
  }

  updateReminder(reminder: Reminder) {
    this.DataProvider.updateReminder(reminder)
  }

}
