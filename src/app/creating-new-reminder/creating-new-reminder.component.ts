import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-reminder-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Nuevo Reminder</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancel()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <!-- Título -->
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="reminder.title" placeholder="Título"></ion-input>
      </ion-item>

      <!-- Descripción -->
      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-textarea [(ngModel)]="reminder.description" placeholder="Descripción"></ion-textarea>
      </ion-item>

      <!-- Fecha y Hora -->
      <ion-item>
        <ion-label position="stacked">Fecha y Hora</ion-label>
        <ion-datetime displayFormat="MMM DD, YYYY HH:mm" [(ngModel)]="reminder.date"></ion-datetime>
      </ion-item>

      <!-- Checkbox de periodicidad semanal -->
      <ion-item>
        <ion-label>Repetir semanalmente</ion-label>
        <ion-checkbox slot="start" [(ngModel)]="reminder.weekly"></ion-checkbox>
      </ion-item>

      <!-- Botón para guardar -->
      <ion-button expand="block" (click)="save()">Guardar</ion-button>
    </ion-content>
  `
})
export class NewReminderModalComponent {
  // Incluimos una propiedad "weekly" para el checkbox y "date" para la fecha.
  reminder: any = { title: '', description: '', date: new Date(), weekly: false };

  constructor(private modalController: ModalController) {}

  save() {
    // Si el checkbox está marcado, asignamos 'weekly' a periodicity; en caso contrario, 'none'
    this.reminder.periodicity = this.reminder.weekly ? 'weekly' : 'none';
    // Cerramos el modal y retornamos el objeto reminder
    this.modalController.dismiss(this.reminder, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
