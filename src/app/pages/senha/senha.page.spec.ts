import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular'; // Importar o módulo do Ionic
import { FormsModule } from '@angular/forms'; // Importar o FormsModule, caso esteja usando ngModel
import { SenhaPage } from './senha.page';

describe('SenhaPage', () => {
  let component: SenhaPage;
  let fixture: ComponentFixture<SenhaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenhaPage ],
      imports: [
        IonicModule.forRoot(), // Certificar que o módulo do Ionic está importado
        FormsModule // Certificar que o FormsModule está importado, caso esteja usando ngModel
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
