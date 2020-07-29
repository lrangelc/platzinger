import { Component, OnInit } from '@angular/core';
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
  croppedImage: any = './../../assets/img/generic_avatar.png';
  user: User;
  friends: User[] = [];
  query: string = '';
  closeResult = '';
  friendEmail = '';

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private requestsService: RequestsService
  ) {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService
          .getUserById(status.uid)
          .valueChanges()
          .subscribe(
            (data: User) => {
              this.user = data;
              this.croppedImage = this.user.avatar;
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

    userService
      .getUsers()
      .valueChanges()
      .subscribe(
        (data: User[]) => {
          this.friends = data;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ngOnInit(): void {}

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
      sender: this.user.uid,
      status: 'pending',
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
}
