import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  price = 78.456487691651;
  today = Date.now();
  user: User;
  conversationID: string;
  textMessage: string;
  conversation: any[];
  senderImage = './../../assets/img/generic_avatar.png';
  receiverImage = './../../assets/img/generic_avatar.png';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService
          .getUserById(status.uid)
          .valueChanges()
          .subscribe(
            (data: User) => {
              this.user = data;
              this.senderImage = this.user.avatar;

              this.friendId = this.activatedRoute.snapshot.params.uid;

              userService
                .getUserById(this.friendId)
                .valueChanges()
                .subscribe(
                  (data2: User) => {
                    this.friend = data2;
                    this.receiverImage = this.friend.avatar;
                    const ids = [this.user.uid, this.friend.uid].sort();
                    this.conversationID = ids.join('|');

                    this.getConversation();
                  },
                  (err) => {
                    console.error(err);
                  }
                );
            },
            (err) => {
              console.error(err);
            }
          );
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {}

  sendMessage(): void {
    const message = {
      uid: this.conversationID,
      timestamp: Date.now(),
      textMessage: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  getConversation(): void {
    this.conversationService
      .getConversation(this.conversationID)
      .valueChanges()
      .subscribe(
        (data) => {
          this.conversation = data;

          this.conversation.forEach((message) => {
            if (!message.seen) {
              message.seen = true;
              this.conversationService.editConversation(
                this.conversationID,
                'Chat' + message.timestamp.toString()
              );
              const audio = new Audio('./../../assets/sound/new_message.m4a');
              audio.play();
            }
          });
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getUserNickById(id: string) {
    if (id === this.friend.uid) {
      return this.friend.nick;
    }
    return this.user.nick;
  }
}
