import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-reminder-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'creating-new-reminder.component.html',
  styleUrls: ['creating-new-reminder.component.scss']
})
export class NewReminderModalComponent {
  // Objeto reminder con propiedades iniciales
  reminder: any = { title: '', description: '', date: new Date(), weekly: false };

  constructor(private modalController: ModalController) { }

  save() {
    // Se asigna 'weekly' a periodicity si el checkbox está marcado
    this.reminder.periodicity = this.reminder.weekly ? 'weekly' : 'none';
    this.modalController.dismiss(this.reminder, 'confirm');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
}
