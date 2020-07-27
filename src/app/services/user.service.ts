import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private angularFirestore: AngularFirestore) {}

  getUsers() {
    return this.angularFirestore.collection('users');
  }

  getUserById(uid: string) {
    return this.angularFirestore.collection('users').doc(uid);
  }

  createUser(user): Promise<void> {
    return this.angularFirestore.collection('users').doc(user.uid).set(user);
  }

  editUser(user: User): Promise<void> {
    return this.angularFirestore.collection('users').doc(user.uid).update(user);
  }

  setAvatar(uid: string, avatar: string): Promise<void> {
    return this.angularFirestore.collection('users').doc(uid).update(avatar);
  }
}
