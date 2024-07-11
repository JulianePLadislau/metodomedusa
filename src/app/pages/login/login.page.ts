import { Component } from '@angular/core';
import { AuthService } from '../../auth-service.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Injetar AlertController
  ) {}

  async login() {
    if (this.email && this.password) { // Verifica se email e senha estão preenchidos
      try {
        const result = await this.authService.loginWithEmail(this.email, this.password);
        console.log(result);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error(error);
        // Exibir alerta em caso de erro no login
        this.presentAlert('Erro', 'Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente.');
      }
    } else {
      // Exibir alerta se email ou senha estiverem em branco
      this.presentAlert('Atenção', 'Por favor, preencha o e-mail e senha para fazer login.');
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then((result) => {
        console.log(result);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          console.error('O popup foi fechado pelo usuário antes de finalizar a operação.');
        } else {
          console.error(error);
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Função para exibir alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
