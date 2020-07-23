import { Component, OnInit } from '@angular/core';
import { User } from './../interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  friends: User[];

  constructor() {
    const user: User = {
      nick: 'Luis',
      email: 'luisrangelc@gmail.com',
      friend: true,
      uid: 1,
    };
    const users: User[] = [];
    users.push(user);
    console.log(user);
    console.log(users);

    const usuario1: User = {
      nick: 'Eduardo',
      age: 24,
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 1,
    };
    const usuario2: User = {
      nick: 'Freddy',
      age: 28,
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 1,
    };
    const usuario3: User = {
      nick: 'Yuliana',
      age: 18,
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 1,
    };
    const usuario4: User = {
      nick: 'Ricardo',
      age: 17,
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 1,
    };
    const usuario5: User = {
      nick: 'Marcos',
      age: 30,
      email: 'marcos@aoe.aoe',
      friend: false,
      uid: 1,
    };

    this.friends = [usuario1, usuario2, usuario3, usuario4, usuario5];
  }

  ngOnInit(): void {}
}
