// edit-reminder-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-reminder-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Editar Reminder</ion-title>
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
        <ion-input [(ngModel)]="editedReminder.title" placeholder="Título"></ion-input>
      </ion-item>

      <!-- Descripción -->
      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-textarea [(ngModel)]="editedReminder.description" placeholder="Descripción"></ion-textarea>
      </ion-item>

      <!-- Fecha y Hora -->
      <ion-item>
        <ion-label position="stacked">Fecha y Hora</ion-label>
        <ion-datetime displayFormat="MMM DD, YYYY HH:mm" [(ngModel)]="editedReminder.date"></ion-datetime>
      </ion-item>

      <!-- Checkbox de periodicidad semanal -->
      <ion-item>
        <ion-label>Repetir semanalmente</ion-label>
        <ion-checkbox slot="start" [(ngModel)]="editedReminder.weekly"></ion-checkbox>
      </ion-item>

      <ion-button expand="block" (click)="save()">Actualizar</ion-button>
    </ion-content>
  `
})
export class EditReminderModalComponent implements OnInit {
  @Input() reminder: any;
  editedReminder: any = {};

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Se crea una copia del reminder para editarlo
    this.editedReminder = { ...this.reminder };
    // Convertimos la periodicidad en un booleano para el checkbox
    this.editedReminder.weekly = this.editedReminder.periodicity === 'weekly';
  }

  save() {
    this.editedReminder.periodicity = this.editedReminder.weekly ? 'weekly' : 'none';
    this.modalController.dismiss(this.editedReminder, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
