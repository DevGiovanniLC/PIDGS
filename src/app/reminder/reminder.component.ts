import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewReminderModalComponent } from '../creating-new-reminder/creating-new-reminder.component';
import { EditReminderModalComponent } from '../editing-reminder-modal/editing-reminder-modal.component';

interface Reminder {
  id: number;
  title: string;
  description: string;
  date: Date;
  periodicity?: string; // Ejemplo: 'none', 'daily', 'weekly', 'monthly'
}

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
      <div *ngFor="let reminder of reminders" class="p-4 border rounded mb-2 flex justify-between items-center" (click)="openEditModal(reminder)">
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
export class ReminderComponent {
  reminders: Reminder[] = [
    { id: 1, title: 'Comprar leche', description: 'Recordar comprar leche en el súper', date: new Date(), periodicity: 'none' },
    { id: 2, title: 'Llamar al doctor', description: 'Cita médica a las 3 PM', date: new Date(), periodicity: 'none' }
  ];

  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: NewReminderModalComponent
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      // Aseguramos que se definan los nuevos campos (date y periodicity)
      const newReminder: Reminder = { 
        ...data, 
        id: this.reminders.length + 1, 
        periodicity: data.periodicity || 'none' 
      };
      this.reminders.push(newReminder);
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
      const index = this.reminders.findIndex(r => r.id === reminder.id);
      if (index !== -1) {
        // Actualizamos el reminder con los nuevos datos, manteniendo el mismo id
        this.reminders[index] = { ...data, id: reminder.id };
      }
    }
  }

  deleteReminder(reminder: Reminder) {
    this.reminders = this.reminders.filter(r => r.id !== reminder.id);
  }
}
