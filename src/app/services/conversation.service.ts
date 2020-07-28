import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  constructor(private angularFirestore: AngularFirestore) {}

  createConversation(conversation) {
    console.log('conversation');
    console.log(conversation);
    // return this.angularFirestore
    //   .collection('conversations')
    //   .doc(conversation.uid).set(conversation);
    return this.angularFirestore
      .collection(
        'conversations/' + conversation.uid + '/' + conversation.timestamp
      )
      .add(conversation);
  }

  getConversation(uid) {
    return this.angularFirestore.collection('conversations').doc(uid);
  }
}
