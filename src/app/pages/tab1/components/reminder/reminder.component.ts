import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReminderManagerService } from 'src/app/services/ReminderManager.service';
import { Reminder } from 'src/app/models/Reminder';

@Component({
  selector: 'app-reminder-monolitico',
  templateUrl: 'reminder.component.html',
  styleUrls: ['reminder.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ReminderComponent implements OnInit {
  reminders: Reminder[] = [];
  swipedReminderId: number | null = null;
  startX = 0;
  showNewReminderModal: boolean = false;
  showEditReminderModal: boolean = false;

  newReminder!: Reminder;
  editedReminder!: Reminder;


  constructor(private readonly reminderManager: ReminderManagerService) { }

  ngOnInit(): void {
    this.updateReminderList();
  }

  // CRUD de recordatorios
  addReminder(): void {
    if (!this.newReminder.title || !this.newReminder.date) return;

    this.reminderManager.addReminder(this.newReminder)
    this.updateReminderList();
    this.closeNewReminderModal();
  }

  updateReminder(): void {
    if (!this.editedReminder.title || !this.editedReminder.date) return;

    this.editedReminder.periodicity = this.editedReminder.weekly ? 'weekly' : 'none';

    this.reminderManager.updateReminder(this.editedReminder);
    this.updateReminderList();
    this.closeEditReminderModal();
  }

  deleteReminder(reminder: Reminder): void {
    this.reminderManager.deleteReminder(reminder);
    this.updateReminderList();
    this.swipedReminderId = null;
  }

  // Funciones para el modal de nuevo reminder
  openNewReminderModal(): void {
    this.newReminder = { id: this.reminders.length + 1, title: '', description: '', date: new Date().toISOString().slice(0, 16), periodicity: 'none', weekly: false };
    this.showNewReminderModal = true;
  }

  closeNewReminderModal(): void {
    this.showNewReminderModal = false;
  }

  // Funciones para el modal de edición
  openEditReminder(reminder: Reminder): void {
    // Evita abrir el modal si se encuentra en estado de swipe
    if (this.swipedReminderId === reminder.id) return;

    this.editedReminder = { ...reminder };
    this.showEditReminderModal = true;
  }

  closeEditReminderModal(): void {
    this.showEditReminderModal = false;
  }

  // Handlers para detectar el swipe (movimiento táctil)
  startSwipe(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  moveSwipe(event: TouchEvent, reminderId: number): void {
    const currentX = event.touches[0].clientX;
    const deltaX = this.startX - currentX;
    if (deltaX > 50) {
      this.swipedReminderId = reminderId;
    }
  }

  endSwipe(event: TouchEvent): void {
    const endX = event.changedTouches[0].clientX;
    const deltaX = this.startX - endX;
    if (deltaX < 30) {
      this.swipedReminderId = null;
    }
  }

  // Función para actualizar la lista de recordatorios para sincronizar datos
  private updateReminderList(): void {
    this.reminderManager.getReminders().then((reminders: Reminder[]) => {
      this.reminders = reminders;
    })
  }

}
