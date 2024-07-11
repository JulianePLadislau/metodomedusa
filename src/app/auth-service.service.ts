import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  logoutGoogle() {
    return new Promise<void>((resolve, reject) => {
      const googleAuth = firebase.auth().currentUser;
      if (googleAuth) {
        googleAuth
          .reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(() => {
            return googleAuth.unlink(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('No Google user authenticated.'));
      }
    });
  }

  getUser() {
    return this.afAuth.authState;
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}
