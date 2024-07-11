import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Verifique se está correto conforme seu ambiente
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { AuthService } from './auth-service.service'; // Importe seu serviço AuthService
import { ResetPasswordInfoComponent } from './reset-password-info.component'; // Importe o componente ResetPasswordInfoComponent

@NgModule({
  declarations: [
    AppComponent,
    ResetPasswordInfoComponent // Adicione o componente aqui
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService // Adicione AuthService aos providers se ainda não estiver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
