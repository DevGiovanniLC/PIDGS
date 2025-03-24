import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/services/Notification.service';
import { Notification } from '../model/Notification';

@Component({
  standalone: true,
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Tab3Page {
  permitState: number = 0;

  // Propiedades enlazadas con [(ngModel)] en el HTML
  notificationTitle: string = '';
  notificationBody: string = '';
  scheduleTime: string = '';

  constructor(
    private notificationService: NotificationService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.permitState = await this.notificationService.requestPermissions();
  }

  async scheduleNotification() {
    const notification: Notification = {
      title: this.notificationTitle,
      body: this.notificationBody,
      scheduleTime: this.scheduleTime
    };

    const success = await this.notificationService.scheduleNotification(notification);

    const toast = await this.toastController.create({
      message: success
        ? 'Notificación encolada'
        : 'Por favor, completa todos los campos',
      duration: 2000,
      position: 'bottom',
      color: success ? 'success' : 'danger'
    });
    toast.present();
  }
}
