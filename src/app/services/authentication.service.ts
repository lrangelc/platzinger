import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private angularFireAuth: AngularFireAuth) {}

  loginWithEmail(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmail(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  getStatus(): Observable<firebase.User> {
    return this.angularFireAuth.authState;
  }

  logOut(): Promise<void> {
    return this.angularFireAuth.signOut();
  }
}
