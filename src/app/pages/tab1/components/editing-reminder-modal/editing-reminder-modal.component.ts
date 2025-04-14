import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-reminder-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'editing-reminder-modal.component.html',
  styleUrls: ['./editing-reminder-modal.component.scss']
})
export class EditReminderModalComponent implements OnInit {
  @Input() reminder: any;
  // Crea una copia del objeto para editar
  editedReminder: any = {};

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.editedReminder = { ...this.reminder };
    // Convierte la periodicidad en booleano para el checkbox
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
