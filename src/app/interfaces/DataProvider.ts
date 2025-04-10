import { Reminder } from "../models/Reminder";

export interface DataProvider {
  getReminders(): Promise<Reminder[]>;

  addReminder(reminder: Reminder): Promise<boolean>;

  deleteReminder(reminder: Reminder): Promise<boolean>;

  updateReminder(reminder: Reminder): Promise<boolean>;
}
