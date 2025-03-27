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
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="reminder.title" placeholder="Título"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-textarea [(ngModel)]="reminder.description" placeholder="Descripción"></ion-textarea>
      </ion-item>
      <ion-button expand="block" (click)="save()">Guardar</ion-button>
    </ion-content>
  `
})
export class NewReminderModalComponent {
  reminder = { title: '', description: '', date: new Date() };

  constructor(private modalController: ModalController) {}

  save() {
    // Se cierra el modal retornando los datos ingresados
    this.modalController.dismiss(this.reminder, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
