import { Component, OnInit, signal } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importación de los modales de agregar y editar
import { NewReminderModalComponent } from '../creating-new-reminder/creating-new-reminder.component';
import { EditReminderModalComponent } from '../editing-reminder-modal/editing-reminder-modal.component';

import { ReminderManagerService } from 'src/app/services/ReminderManager.service';
import { NotificationService } from 'src/app/services/Notification.service';
import { Reminder } from 'src/app/models/Reminder';
import { Notification } from 'src/app/models/Notification';

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {
  reminders = signal<Reminder[]>([]);

  constructor(
    private modalController: ModalController,
    private reminderManager: ReminderManagerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadReminders();
    // Solicita permisos para notificaciones si es necesario
    this.notificationService.requestPermissions();
  }

  private async loadReminders() {
    this.reminders.set(await this.reminderManager.getReminders());
  }

  async openNewReminderModal() {
    const modal = await this.modalController.create({
      component: NewReminderModalComponent
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      const newReminder: Reminder = {
        id: this.reminders().length + 1,
        ...data,
        periodicity: data.periodicity || 'none'
      };

      // Agrega el nuevo reminder y actualiza el listado
      this.reminderManager.addReminder(newReminder);
      this.reminders.update(reminders => [...reminders, newReminder]);

      // Opcional: Programar notificación
      const notification: Notification = {
        title: newReminder.title,
        body: newReminder.description,
        scheduleTime: new Date(newReminder.date).toISOString()
      };
      await this.notificationService.scheduleNotification(notification);
    }
  }

  async openEditReminderModal(reminder: Reminder) {
    const modal = await this.modalController.create({
      component: EditReminderModalComponent,
      componentProps: { reminder }
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      const updatedReminder = data as Reminder;
      this.reminders.update(reminders =>
        reminders.map(r => r.id === reminder.id ? updatedReminder : r)
      );
      this.reminderManager.updateReminder(updatedReminder);
    }
  }

  deleteReminder(reminder: Reminder) {
    this.reminders.update(reminders => reminders.filter(r => r.id !== reminder.id));
    this.reminderManager.deleteReminder(reminder);
  }
}
