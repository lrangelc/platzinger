import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user/user.service';
import { RequestsService } from '../services/requests/requests.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  active = 1;

  croppedImage: any = './../../assets/img/generic_avatar.png';
  user: User;
  friends: User[] = [];
  query: string = '';
  closeResult = '';
  friendEmail = '';

  requests: any[];
  requestsLength = 0;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private requestsService: RequestsService
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
              this.croppedImage = this.user.avatar;
              this.getRequests();

              if (this.user.friends) {
                if (this.user.friends.length > 0) {
                  this.userService
                    .getUsers(this.user.friends)
                    .valueChanges()
                    .subscribe(
                      (data2: User[]) => {
                        this.friends = data2;
                      },
                      (err) => {
                        console.error(err);
                      }
                    );
                }
              }
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

  open(content): void {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          console.log('this.closeResult');
          console.log(this.closeResult);
          this.sendRequest();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log('this.closeResult');
          console.log(this.closeResult);
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendRequest(): void {
    console.log('sendRequest triggered');
    const request = {
      timestamp: Date.now(),
      receiverEmail: this.friendEmail,
      senderNick: this.user.nick,
      senderEmail: this.user.email,
      sender: this.user.uid,
      status: 'pending',
      seen: false,
    };
    this.requestsService
      .createRequest(request)
      .then(() => {
        console.log('Solicitud Enviada!');
      })
      .catch((err) => {
        console.error('Error al enviar la solicitud!!!');
        console.error(err);
      });
    console.log('sendRequest end');
  }

  getRequests(): void {
    this.requestsService
      .getRequests(this.user.email)
      .valueChanges()
      .subscribe(
        (data: any) => {
          console.log('data');
          console.log(data);
          this.requests = data;
          this.requestsLength = this.requests.length;

          this.requests.forEach((message) => {
            message.id = 'Request' + message.timestamp.toString();
            if (!message.seen) {
              message.seen = true;
              this.requestsService.editRequest(
                this.user.email,
                'Request' + message.timestamp.toString()
              );
            }
          });
          console.log('this.requests');
          console.log(this.requests);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  acceptRequest(requestID: string, sender: string): void {
    this.requestsService.acceptRequest(this.user.email, requestID).then(
      () => {
        this.userService.addFriend(this.user.uid, sender);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  deleteRequest(requestID: string): void {
    this.requestsService.deleteRequest(this.user.email, requestID);
  }
}
