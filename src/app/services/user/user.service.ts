import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private angularFirestore: AngularFirestore) {}

  getUsers(friends: string[]): any {
    return this.angularFirestore.collection('users', (ref) =>
      ref.where('uid', 'in', friends)
    );
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
    return this.angularFirestore
      .collection('users')
      .doc(uid)
      .update({ avatar });
  }

  addFriend(uid: string, friendID: string): Promise<void> {
    this.angularFirestore
      .collection('users')
      .doc(uid)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(friendID),
      });

    return this.angularFirestore
      .collection('users')
      .doc(friendID)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(uid),
      });
  }
}
