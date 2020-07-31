import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private angularFirestore: AngularFirestore) {}

  createRequest(request): Promise<void> {
    // const cleanEmail = request.receiverEmail.replace(/\./g, ',');
    const cleanEmail = request.receiverEmail;

    return this.angularFirestore
      .collection('requests/' + cleanEmail + '/request')
      .doc('Request' + request.timestamp.toString())
      .set(request);

    // const docRef = firebase.firestore().collection('requests').doc(cleanEmail);

    // return docRef
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       console.log('Document data:', doc.data());
    //       return this.angularFirestore
    //         .collection('requests')
    //         .doc(cleanEmail)
    //         .update({
    //           regions: firebase.firestore.FieldValue.arrayUnion(request),
    //         });
    //     } else {
    //       return this.angularFirestore
    //         .collection('requests')
    //         .doc(cleanEmail)
    //         .set({
    //           regions: firebase.firestore.FieldValue.arrayUnion(request),
    //         });
    //       console.log('No such document!');
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('Error getting document:', error);
    //   });
  }

  updateRequestsSeen(requestsID: string, requests) {
    return this.angularFirestore.collection('requests').doc(requestsID).update({
      regions: requests,
    });
  }

  getRequests(email: string) {
    return this.angularFirestore.collection(
      'requests/' + email + '/request',
      (ref) => ref.where('status', '==', 'pending')
    );
  }

  editRequest(email, requestID) {
    return this.angularFirestore
      .collection('requests/' + email + '/request')
      .doc(requestID)
      .update({ seen: true });
  }

  acceptRequest(email, requestID) {
    return this.angularFirestore
      .collection('requests/' + email + '/request')
      .doc(requestID)
      .update({ status: 'accepted' });
  }

  deleteRequest(email, requestID) {
    return this.angularFirestore
      .collection('requests/' + email + '/request')
      .doc(requestID)
      .update({ status: 'deleted' });
  }
}
