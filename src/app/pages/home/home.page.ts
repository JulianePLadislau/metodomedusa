import { Component } from '@angular/core';
import { AuthService } from '../../auth-service.service'; // Ajuste o caminho conforme necessário
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  constructor(private authService: AuthService, private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout()
      .then(() => {
        console.log('Logout realizado com sucesso.');
        // Redireciona para a página de login após o logout
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }
}


