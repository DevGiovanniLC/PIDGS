import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Reminder {
  id: number;
  title: string;
  description: string;
  date: string;
  periodicity: 'weekly' | 'none';
  weekly: boolean;
}

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

  // Modelo para nuevo reminder
  newReminder: Reminder = {
    id: 0,
    title: '',
    description: '',
    date: '',
    periodicity: 'none',
    weekly: false
  };

  // Modelo para edición
  editedReminder: Reminder = {
    id: 0,
    title: '',
    description: '',
    date: '',
    periodicity: 'none',
    weekly: false
  };

  ngOnInit(): void {
    this.reminders = [
      {
        id: 1,
        title: 'Comprar alimentos',
        description: 'Frutas, verduras y pan',
        date: new Date().toISOString(),
        periodicity: 'none',
        weekly: false
      },
      {
        id: 2,
        title: 'Reunión de trabajo',
        description: 'Planificar proyecto',
        date: new Date().toISOString(),
        periodicity: 'weekly',
        weekly: true
      }
    ];
  }

  // Funciones para el modal de nuevo reminder
  openNewReminderModal(): void {
    this.newReminder = { id: 0, title: '', description: '', date: '', periodicity: 'none', weekly: false };
    this.showNewReminderModal = true;
  }

  closeNewReminderModal(): void {
    this.showNewReminderModal = false;
  }

  addReminder(): void {
    if (!this.newReminder.title || !this.newReminder.date) {
      return;
    }
    const newId = this.reminders.length > 0 ? Math.max(...this.reminders.map(r => r.id)) + 1 : 1;
    const reminderToAdd: Reminder = { ...this.newReminder, id: newId };
    reminderToAdd.periodicity = reminderToAdd.weekly ? 'weekly' : 'none';
    this.reminders.push(reminderToAdd);
    this.closeNewReminderModal();
  }

  // Funciones para el modal de edición
  openEditReminder(reminder: Reminder): void {
    // Evita abrir el modal si se encuentra en estado de swipe
    if (this.swipedReminderId === reminder.id) {
      return;
    }
    this.editedReminder = { ...reminder };
    this.showEditReminderModal = true;
  }

  closeEditReminderModal(): void {
    this.showEditReminderModal = false;
  }

  updateReminder(): void {
    if (!this.editedReminder.title || !this.editedReminder.date) {
      return;
    }
    this.editedReminder.periodicity = this.editedReminder.weekly ? 'weekly' : 'none';
    const index = this.reminders.findIndex(r => r.id === this.editedReminder.id);
    if (index !== -1) {
      this.reminders[index] = { ...this.editedReminder };
    }
    this.closeEditReminderModal();
  }

  deleteReminder(reminder: Reminder): void {
    this.reminders = this.reminders.filter(r => r.id !== reminder.id);
    this.swipedReminderId = null;
  }

  // Handlers para detectar el swipe (movimiento táctil)
  startSwipe(event: TouchEvent, reminderId: number): void {
    this.startX = event.touches[0].clientX;
  }

  moveSwipe(event: TouchEvent, reminderId: number): void {
    const currentX = event.touches[0].clientX;
    const deltaX = this.startX - currentX;
    if (deltaX > 50) {
      this.swipedReminderId = reminderId;
    }
  }

  endSwipe(event: TouchEvent, reminderId: number): void {
    const endX = event.changedTouches[0].clientX;
    const deltaX = this.startX - endX;
    if (deltaX < 30) {
      this.swipedReminderId = null;
    }
  }
}
