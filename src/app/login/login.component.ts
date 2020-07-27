import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.authenticationService
      .loginWithEmail(this.email, this.password)
      .then((data) => {
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        alert('Ocurrio un error');
        console.error(err);
      });
  }

  register(): void {
    this.authenticationService
      .registerWithEmail(this.email, this.password)
      .then((data) => {
        const user = {
          uid: data.user.uid,
          email: data.user.email,
          nick: this.nick,
          status: 'online',
          subnick: '',
        };
        this.userService
          .createUser(user)
          .then((data2) => {
            this.router.navigate(['/home']);
          })
          .catch((err) => {
            alert('Ocurrio un error');
            console.error(err);
          });
      })
      .catch((err) => {
        alert('Ocurrio un error');
        console.error(err);
      });
  }
}
