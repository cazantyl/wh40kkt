import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static authState: any;
  private static user: any;

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      AuthService.authState = auth;
    });
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  doLogin(value): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        firebase
          .auth()
          .signInWithEmailAndPassword(value.email, value.password)
          .then(
            res => {
              resolve(res);
            },
            err => reject(err)
          );
      });
  }

  doLogout() {
    if (firebase.auth().currentUser) {
      firebase
        .auth()
        .signOut()
        .then(function () {

        });
    }
  }

  get authenticated(): boolean {
    return AuthService.authState !== null;
  }

  get user(): any {
    return this.authenticated ? AuthService.authState : null;
  }

  get isWhiteListed(): boolean {
    if (this.user) {
      return environment.whitelist.includes(this.user.email);
    } else {
      return false;
    }
  }
}
