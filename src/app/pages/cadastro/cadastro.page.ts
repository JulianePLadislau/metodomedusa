import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CpfService } from '../../cpf.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  cpf: string = '';
  cpfInvalido: boolean = false;
  cpfJaCadastrado: boolean = false;
  dataNascimento: string = '';
  nome: string = '';
  sobrenome: string = '';
  email: string = '';
  senha: string = '';
  senhaVisivel: boolean = false; // Variável para controlar a visibilidade da senha


  constructor(
    private alertController: AlertController,
    private cpfService: CpfService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async validarCPF() {
    this.cpfInvalido = !this.cpfService.validarCPF(this.cpf);
    await this.verificarCpfCadastrado();
  }

  async verificarCpfCadastrado() {
    try {
      const snapshot = await this.firestore.collection('usuarios', ref => ref.where('cpf', '==', this.cpf)).get().toPromise();
      
      if (snapshot && !snapshot.empty) {
        this.cpfJaCadastrado = true; // CPF já cadastrado
      } else {
        this.cpfJaCadastrado = false; // CPF não cadastrado
      }

    } catch (error) {
      console.error('Erro ao verificar CPF cadastrado:', error);
      this.cpfJaCadastrado = false; // Define como não cadastrado em caso de erro
    }
  }

  async cadastrar() {
    // Validação básica dos campos
    if (!this.nome || !this.sobrenome || !this.cpf || !this.dataNascimento || !this.email || !this.senha) {
      await this.exibirAlerta('Todos os campos são obrigatórios.');
      return;
    }

    // Verifica se o CPF é válido
    if (!this.cpfService.validarCPF(this.cpf)) {
      await this.exibirAlerta('CPF inválido.');
      return;
    }

    // Verifica se o CPF já está cadastrado
    if (this.cpfJaCadastrado) {
      await this.exibirAlerta('CPF já cadastrado. Você já possui uma conta ativa.');
      return;
    }

    // Verifica se a data de nascimento está no formato DD/MM/YYYY
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(this.dataNascimento)) {
      await this.exibirAlerta('Informe a data de nascimento no formato DD/MM/YYYY.');
      return;
    }

    // Verifica se o e-mail está no formato correto
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(this.email)) {
      await this.exibirAlerta('Formato de e-mail inválido. Por favor, verifique o e-mail informado.');
      return;
    }

    // Verifica se a senha atende aos critérios mínimos do Firebase Auth
    const senhaMinima = 6; // Exemplo: senha deve ter no mínimo 6 caracteres
    if (this.senha.length < senhaMinima) {
      await this.exibirAlerta(`A senha deve ter no mínimo ${senhaMinima} caracteres.`);
      return;
    }

    try {
      // Cria o usuário no Firebase Auth
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.senha);

      if (userCredential.user) {
        // Adiciona informações adicionais ao Firestore
        await this.firestore.collection('usuarios').doc(userCredential.user.uid).set({
          nome: this.nome,
          sobrenome: this.sobrenome,
          cpf: this.formatarCPF(this.cpf), // Formata o CPF antes de salvar
          dataNascimento: this.dataNascimento,
          email: this.email
          // Adicione outros campos conforme necessário
        });

        console.log('Usuário cadastrado com sucesso:', userCredential.user);
        await this.exibirAlerta('Cadastro realizado com sucesso!');
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redireciona após 2 segundos

      } else {
        await this.exibirAlerta('Erro ao cadastrar usuário: Não foi possível obter informações do usuário.');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        await this.exibirAlerta('O e-mail fornecido já está em uso. Por favor, use um e-mail diferente.');
      } else {
        await this.exibirAlerta(`Erro ao cadastrar usuário: ${error.message}`);
      }
    }
  }

  formatarCPF(cpf: string): string {
    // Remove todos os caracteres que não são dígitos
    cpf = cpf.replace(/\D/g, '');

    // Aplica a máscara
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    return cpf;
  }

  async abrirCalendario() {
    const hoje = new Date().toISOString();
    const anoAtual = hoje.split('T')[0];

    const alert = await this.alertController.create({
      header: 'Selecione a Data de Nascimento',
      inputs: [
        {
          name: 'dataNascimento',
          type: 'date',
          value: this.dataNascimento,
          max: anoAtual,
          placeholder: 'DD/MM/YYYY',
          attributes: {
            inputmode: 'numeric',
            pattern: '\\d*'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Seleção de data cancelada');
          }
        }, {
          text: 'Confirmar',
          handler: (data) => {
            console.log('Data selecionada:', data.dataNascimento);
            // Formate a data para DD/MM/YYYY antes de atribuir à variável
            const dataFormatada = this.formatarData(data.dataNascimento);
            this.dataNascimento = dataFormatada;
          }
        }
      ]
    });

    await alert.present();
  }

  private formatarData(data: string): string {
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  }

  private async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  togglePasswordVisibility() {
    this.senhaVisivel = !this.senhaVisivel; // Alterna entre true e false
  }

}
