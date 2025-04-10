import { DataProvider } from "../../interfaces/DataProvider";
import { Reminder } from "../../models/Reminder";

export class LocalStorageProvider implements DataProvider {

  getReminders(): Promise<Reminder[]> {
    if (!localStorage.getItem('reminders')) localStorage.setItem('reminders', JSON.stringify([]));
    return Promise.resolve(JSON.parse(localStorage.getItem('reminders') || '[]'));
  }

  addReminder(reminder: Reminder): Promise<boolean> {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    return Promise.resolve(true);
  }

  deleteReminder(reminder: Reminder): Promise<boolean> {
    const reminders: Reminder[] = JSON.parse(localStorage.getItem('reminders') || '[]');
    const deletedReminders = reminders.filter(r => r.id !== reminder.id);
    localStorage.setItem('reminders', JSON.stringify(deletedReminders));
    return Promise.resolve(true);
  }

  updateReminder(reminder: Reminder): Promise<boolean> {
    const reminders: Reminder[] = JSON.parse(localStorage.getItem('reminders') || '[]');
    const updatedReminders = reminders.map(r => r.id === reminder.id ? reminder : r);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    return Promise.resolve(true);
  }


}
