import { DataProvider } from "../interfaces/DataProvider";
import { Reminder } from "../model/Reminder";

export class LocalStorageProvider implements DataProvider {
  getReminders(): Promise<Reminder[]> {
    localStorage.setItem('reminders', JSON.stringify([]));
    return Promise.resolve(JSON.parse(localStorage.getItem('reminders') || '[]'));
  }

  addReminder(reminder: Reminder): Promise<boolean> {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    return Promise.resolve(true);
  }

  deleteReminder(reminder: Reminder): Promise<boolean> {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.splice(reminders.indexOf(reminder), 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    return Promise.resolve(true);
  }

}
