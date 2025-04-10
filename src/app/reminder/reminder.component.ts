import { Component, OnInit, signal, Signal } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewReminderModalComponent } from '../creating-new-reminder/creating-new-reminder.component';
import { EditReminderModalComponent } from '../editing-reminder-modal/editing-reminder-modal.component';
import { ReminderManagerService } from 'src/app/services/ReminderManager.service';
import { Reminder } from '../models/Reminder';


@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./reminder.component.scss'],
  template: `
    <div class="container mx-auto p-4">
      <!-- Título con color principal azul -->
      <h1 class="text-2xl font-bold mb-4 text-blue-500">Mis Reminders</h1>

      <!-- Lista de reminders -->
      <div *ngFor="let reminder of reminders()" class="p-4 border rounded mb-2 flex justify-between items-center" (click)="openEditModal(reminder)">
        <div>
          <h2 class="text-xl font-semibold">{{ reminder.title }}</h2>
          <p>{{ reminder.description }}</p>
          <p class="text-gray-500 text-sm">
            {{ reminder.date | date:'short' }}
            <span *ngIf="reminder.periodicity && reminder.periodicity !== 'none'">
              - {{ reminder.periodicity | titlecase }}
            </span>
          </p>
        </div>
        <div class="flex space-x-2" (click)="$event.stopPropagation()">
          <!-- Botón de editar en amarillo con icono -->
          <ion-button color="warning" (click)="openEditModal(reminder)">
            <ion-icon name="pencil-outline"></ion-icon>
          </ion-button>
          <!-- Botón de eliminar en rojo con icono -->
          <ion-button color="danger" (click)="deleteReminder(reminder)">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </div>
      </div>

      <!-- Botón para agregar un nuevo reminder -->
      <div class="mb-4 flex justify-center">
        <ion-button color="primary" (click)="openModal()">
          Nuevo Reminder
        </ion-button>
      </div>
    </div>
  `
})
export class ReminderComponent implements OnInit {
  reminders = signal<Reminder[]>([]);

  constructor(private modalController: ModalController, private reminderManager: ReminderManagerService) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  private async loadReminders() {
    this.reminders.set(await this.reminderManager.getReminders());
  }

  async openModal() {

    const modal = await this.modalController.create({
      component: NewReminderModalComponent
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {

      // Aseguramos que se definan los nuevos campos (date y periodicity)
      const newReminder: Reminder = {
        id: this.reminders().length + 1,
        ...data,
        periodicity: data.periodicity || 'none'
      };

      this.reminderManager.addReminder(newReminder);
      this.reminders.update(reminders => [...reminders, newReminder]);
    }
  }

  async openEditModal(reminder: Reminder) {
    const modal = await this.modalController.create({
      component: EditReminderModalComponent,
      componentProps: { reminder }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      const index = this.reminders().findIndex(r => r.id === reminder.id);
      if (index !== -1) {
        const updatedReminder = data as Reminder;
        // Actualizamos el reminder con los nuevos datos, manteniendo el mismo id
        this.reminders.update(reminders => reminders.map(r => r.id === reminder.id ? updatedReminder : r));
        this.reminderManager.updateReminder(updatedReminder);
      }
    }
  }

  deleteReminder(reminder: Reminder) {
    this.reminders.update(reminders => reminders.filter(r => r.id !== reminder.id));
    this.reminderManager.deleteReminder(reminder);
  }
}
