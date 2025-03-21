import { Reminder } from "../model/Reminder";

export interface DataProvider {
  getReminders(): Promise<Reminder[]>;

  addReminder(reminder: Reminder): Promise<boolean>;

  deleteReminder(reminder: Reminder): Promise<boolean>;
}
