import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { RequestsService } from 'src/app/services/requests/requests.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  user: User;
  closeResult = '';
  shouldAdd = 'yes';
  currentRequest: { sender: '' };

  requests: any[];
  showModal = false;
  modalIsOpen = false;

  @ViewChild('content2') divView: ElementRef;

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
              this.getRequests();
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

  open(content): void {
    console.log('content');
    console.log(content);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.modalIsOpen = false;
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.modalIsOpen = false;
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  open2(): void {
    this.modalIsOpen = true;
    const content = this.divView;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.modalIsOpen = false;
          console.log('cerro2');
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.modalIsOpen = false;
          console.log('cerro1');
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  async getRequests(): Promise<void> {
    this.requestsService
      .getRequests(this.user.email)
      .valueChanges()
      .subscribe(
        (data: any) => {
          this.requests = data;
          console.log('data');
          console.log(data);

          this.requests.forEach((message) => {
            if (!message.seen) {
              if (!this.modalIsOpen) {
                this.showModal = true;
              }
              message.seen = true;
              this.requestsService.editRequest(
                this.user.email,
                'Request' + message.timestamp.toString()
              );
            }
          });
          console.log('this.showModal');
          console.log(this.showModal);
          console.log('this.modalIsOpen');
          console.log(this.modalIsOpen);
          if (this.showModal && !this.modalIsOpen) {
            this.modalIsOpen = true;
            console.log('xxx');
            this.open2();
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
