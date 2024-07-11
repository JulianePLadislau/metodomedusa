import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-reset-password-info',
  templateUrl: './reset-password-info.component.html',
  styleUrls: ['./reset-password-info.component.scss'],
})
export class ResetPasswordInfoComponent {

    constructor(
        private modalController: ModalController,
        private router: Router // Injete o Router no construtor
      ) {}

  close() {
    this.modalController.dismiss();

    this.router.navigate(['/login']); // Certifique-se de que '/login' seja a rota correta para sua página de login

  }
}
