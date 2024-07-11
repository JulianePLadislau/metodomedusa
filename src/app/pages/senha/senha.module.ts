import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SenhaPageRoutingModule } from './senha-routing.module';
import { SenhaPage } from './senha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SenhaPageRoutingModule
  ],
  declarations: [SenhaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Adicionar CUSTOM_ELEMENTS_SCHEMA
})
export class SenhaPageModule {}
