import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewReminderModalComponent } from '../creating-new-reminder/creating-new-reminder.component';

interface Reminder {
  id: number;
  title: string;
  description: string;
  date: Date;
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
      <div *ngFor="let reminder of reminders" class="p-4 border rounded mb-2 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold">{{ reminder.title }}</h2>
          <p>{{ reminder.description }}</p>
          <p class="text-gray-500 text-sm">{{ reminder.date | date:'short' }}</p>
        </div>
        <div class="flex space-x-2">
          <!-- Botón de editar en amarillo con icono -->
          <ion-button color="warning" (click)="editReminder(reminder)">
            <ion-icon name="pencil-outline"></ion-icon>
          </ion-button>
          <!-- Botón de eliminar en rojo con icono -->
          <ion-button color="danger" (click)="deleteReminder(reminder)">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </div>
      </div>

      <!-- Formulario para editar un reminder (visible cuando se edita) -->
      <div *ngIf="editingReminder as edit" class="mt-6">
        <h2 class="text-xl font-semibold mb-2 text-blue-500">Editar Reminder</h2>
        <div class="flex flex-col">
          <ion-item>
            <ion-input [(ngModel)]="edit.title" placeholder="Título"></ion-input>
          </ion-item>
          <ion-item>
            <ion-textarea [(ngModel)]="edit.description" placeholder="Descripción"></ion-textarea>
          </ion-item>
          <div class="flex justify-end space-x-2">
            <ion-button color="primary" (click)="updateReminder()">Actualizar</ion-button>
            <ion-button color="medium" (click)="editingReminder = null">Cancelar</ion-button>
          </div>
        </div>
      </div>

      <!-- Botón para agregar un nuevo reminder -->
      <div class="mb-4">
        <ion-button color="primary" (click)="openModal()">
          Nuevo Reminder
        </ion-button>
      </div>
    </div>
  `
})
export class ReminderComponent {
  reminders: Reminder[] = [
    { id: 1, title: 'Comprar leche', description: 'Recordar comprar leche en el súper', date: new Date() },
    { id: 2, title: 'Llamar al doctor', description: 'Cita médica a las 3 PM', date: new Date() }
  ];

  editingReminder: Reminder | null = null;

  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: NewReminderModalComponent
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      const newReminder: Reminder = { ...data, id: this.reminders.length + 1 };
      this.reminders.push(newReminder);
    }
  }

  deleteReminder(reminder: Reminder) {
    this.reminders = this.reminders.filter(r => r.id !== reminder.id);
  }

  editReminder(reminder: Reminder) {
    // Clonamos el objeto para no modificar directamente la lista
    this.editingReminder = { ...reminder };
  }

  updateReminder() {
    if (this.editingReminder) {
      const index = this.reminders.findIndex(r => r.id === this.editingReminder!.id);
      if (index !== -1) {
        this.reminders[index] = { ...this.editingReminder };
      }
      this.editingReminder = null;
    }
  }
}
