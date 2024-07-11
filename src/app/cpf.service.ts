import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CpfService {

  constructor(private firestore: AngularFirestore) { }

  validarCPF(cpf: string): boolean {
    // Lógica de validação do CPF
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos do CPF

    if (cpf.length !== 11) {
      return false; // CPF deve ter 11 dígitos
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false; // Verifica se todos os dígitos são iguais
    }

    // Calcula os dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto >= 10 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto >= 10 ? 0 : resto;

    if (digitoVerificador1 !== parseInt(cpf.charAt(9)) || digitoVerificador2 !== parseInt(cpf.charAt(10))) {
      return false; // Verifica se os dígitos verificadores estão corretos
    }

    return true; // CPF válido
  }

  verificarCpfCadastrado(cpf: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.firestore.collection('usuarios', ref => ref.where('cpf', '==', cpf))
        .get()
        .pipe(
          map(snapshot => !snapshot.empty)
        )
        .subscribe(
          result => {
            resolve(result); // Retorna true se encontrar algum CPF cadastrado
          },
          error => {
            console.error('Erro ao verificar CPF cadastrado:', error);
            resolve(false); // Retorna false em caso de erro
          }
        );
    });
  }
}
