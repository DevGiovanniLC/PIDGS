import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-config',
  templateUrl: 'config.page.html',
  styleUrls: ['config.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Config implements OnInit {
  autoSync = false;
  isAuthenticated = false;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = localStorage.getItem('auth') === 'true';
    this.autoSync = localStorage.getItem('autoSync') === 'true';
  }

  async signIn() {
    localStorage.setItem('auth', 'true');
    this.isAuthenticated = true;
    await this.showToast('Signed in with Google');
  }

  
  async logout() {
    localStorage.removeItem('auth');
    this.isAuthenticated = false;
    await this.showToast('Logged out from Google');
  }

  async syncNow() {
    // Simulación de sincronización
    await this.showToast('Data synced!');
  }

  toggleAutoSync() {
    localStorage.setItem('autoSync', this.autoSync.toString());
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }

  goToLogin() {
    this.router.navigate(['/tabs/login']);
  }
}
