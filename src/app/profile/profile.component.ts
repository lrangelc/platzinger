import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User;

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
  saveSettings(): void {
    this.userService
      .editUser(this.user)
      .then(() => {})
      .catch((err) => {
        console.error(err);
        alert('Hubo un error al guardar los cambios!');
      });
  }
}
