import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private angularFirestore: AngularFirestore) {}

  createRequest(request): Promise<void> {
    // const cleanEmail = request.receiverEmail.replace(/\./g, ',');
    const cleanEmail = request.receiverEmail;

    const docRef = firebase.firestore().collection('requests').doc(cleanEmail);

    return docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          return this.angularFirestore
            .collection('requests')
            .doc(cleanEmail)
            .update({
              regions: firebase.firestore.FieldValue.arrayUnion(request),
            });
        } else {
          return this.angularFirestore
            .collection('requests')
            .doc(cleanEmail)
            .set({
              regions: firebase.firestore.FieldValue.arrayUnion(request),
            });
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });

    // return this.angularFirestore
    //   .collection('requests')
    //   .doc(cleanEmail)
    //   .update({
    //     regions: firebase.firestore.FieldValue.arrayUnion(request),
    //   });
  }

  ssetRequestStatus(request, status) {
    // const cleanEmail = request.receiverEmail.replace(/\./g, ',');
    const cleanEmail = request.receiverEmail;

    return this.angularFirestore
      .collection('requests')
      .doc(cleanEmail)
      .update({
        regions: firebase.firestore.FieldValue.arrayUnion(request),
      });
  }
}
