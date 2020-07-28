import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from './../services/user.service';

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

  constructor(
    private userService: UserService,
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
}
