import { Component } from '@angular/core';
import { AuthService } from '../../auth-service.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResetPasswordInfoComponent } from '../../reset-password-info.component';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.page.html',
  styleUrls: ['./senha.page.scss'],
})
export class SenhaPage {
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) {}

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email);
      console.log('Password reset email sent');
      this.presentModal();
    } catch (error) {
      console.error(error);
      // Mostrar mensagem de erro aqui
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ResetPasswordInfoComponent
    });
    return await modal.present();
  }
}
