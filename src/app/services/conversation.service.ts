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

    // return this.angularFirestore
    //   .collection(
    //     'conversations/' + conversation.uid + '/' + conversation.timestamp
    //   )
    //   .add(conversation);

    return this.angularFirestore
      .collection('conversations/' + conversation.uid + '/chat')
      .doc('Chat' + conversation.timestamp.toString())
      .set(conversation);
  }

  getConversation(uid: string) {
    return this.angularFirestore.collection('conversations/' + uid + '/chat');
    // return this.angularFirestore.collection('conversations').doc(uid);
  }

  editConversation(conversationID, chatID) {
    return this.angularFirestore
      .collection('conversations/' + conversationID + '/chat')
      .doc(chatID)
      .update({ seen: true });
  }
}
