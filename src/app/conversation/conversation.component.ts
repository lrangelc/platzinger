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

              console.clear();
              this.friendId = this.activatedRoute.snapshot.params.uid;
              console.log('this.friendId');
              console.log(this.friendId);
              userService
                .getUserById(this.friendId)
                .valueChanges()
                .subscribe(
                  (data2: User) => {
                    this.friend = data2;
                    const ids = [this.user.uid, this.friend.uid].sort();
                    this.conversationID = ids.join('|');

                    console.log('this.friend');
                    console.log(this.friend);
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

  sendMessage() {
    const message = {
      uid: this.conversationID,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }
}
