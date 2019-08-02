import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {}

  public getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().onAuthStateChanged(function(tUser) {
        if (tUser) {
          resolve(tUser);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  public updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: value.name,
          photoURL: user.photoURL
        })
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  public isLoggedIn() {
    return firebase.auth().currentUser;
  }
}
