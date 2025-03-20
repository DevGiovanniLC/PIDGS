import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, ToastController } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule],
})
export class Tab3Page {
  permitState: number = 0;

  notificationTitle: string = '';
  notificationBody: string = '';
  scheduleTime: string = '';

  constructor(private toastController: ToastController) {
    this.requestPermits();
  }

  async requestPermits() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      this.permitState = 1;
    } else {
      this.permitState = -1;
    }
  }

  async scheduleNotification() {
    if (!this.notificationTitle.trim() || !this.notificationBody.trim() || !this.scheduleTime.trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      return;
    }

    const scheduledDate = new Date(this.scheduleTime);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: this.notificationTitle,
          body: this.notificationBody,
          schedule: { at: scheduledDate },
        },
      ],
    });

    const toast = await this.toastController.create({
      message: 'Notificación encolada',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
