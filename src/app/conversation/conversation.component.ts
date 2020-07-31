import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user/user.service';
import { ConversationService } from '../services/conversation/conversation.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  senderImage = './assets/img/generic_avatar.png';
  receiverImage = './assets/img/generic_avatar.png';
  shake = false;
  imageReady = false;
  showImage = false;
  uploadingImage = false;

  croppedImage: any;
  imageChangedEvent: any = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService,
    private angularFireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
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

              this.userService
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

  sendMessage(): void {
    const message = {
      uid: this.conversationID,
      timestamp: Date.now(),
      textMessage: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
      type: 'text',
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  sendBuzz(): void {
    const message = {
      uid: this.conversationID,
      timestamp: Date.now(),
      textMessage: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
      type: 'buzz',
    };
    this.conversationService.createConversation(message).then(() => {});
    this.doBuzz();
  }

  sendImage(imageURL: string): void {
    const message = {
      uid: this.conversationID,
      timestamp: Date.now(),
      textMessage: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
      type: 'image',
      imageURL,
    };
    this.conversationService.createConversation(message).then(() => {});
  }

  doBuzz(): void {
    const audio = new Audio('./assets/sound/buzz.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 2000);
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
              if (message.type === 'text') {
                const audio = new Audio('./assets/sound/new_message.m4a');
                audio.play();
              } else if (message.type === 'buzz') {
                this.doBuzz();
              }
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

  // <input type="file" (change)="fileChangeEvent($event.target.files)">
  // fileChangeEvent(e: File[]): void {
  //   console.log('e');
  //   console.log(e);
  //   const fileName = e[0];
  //   const fileType = fileName.type;
  //   console.log('fileName');
  //   console.log(fileName);
  //   console.log('fileType');
  //   console.log(fileType);
  //   if (fileType.includes('image')) {
  //   }
  // }

  fileChangeEvent(event: any): void {
    this.showImage = true;
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageReady = true;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  uploadImage() {
    if (this.croppedImage) {
      this.uploadingImage = true;
      const currentPictureId = Date.now();
      const path = 'chatImage/' + currentPictureId + '.jpg';
      const pictures = this.angularFireStorage
        .ref(path)
        .putString(this.croppedImage, 'data_url');
      pictures
        .then((result) => {
          const picture = this.angularFireStorage.ref(path).getDownloadURL();

          picture.subscribe((p) => {
            this.sendImage(p);
          });

          this.imageReady = false;
          this.showImage = false;
          this.uploadingImage = false;
        })
        .catch((err) => {
          this.uploadingImage = false;
          console.error(err);
        });
    }
  }
}
