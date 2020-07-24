import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
  friends: User[];
  friendId: number;
  friend: User;

  constructor(private activatedRoute: ActivatedRoute) {
    this.friendId = this.activatedRoute.snapshot.params.uid;
    console.log('this.friendId');
    console.log(this.friendId);

    const usuario1: User = {
      nick: 'Eduardo',
      age: 24,
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 2,
    };
    const usuario2: User = {
      nick: 'Freddy',
      age: 28,
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 3,
    };
    const usuario3: User = {
      nick: 'Yuliana',
      age: 18,
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 4,
    };
    const usuario4: User = {
      nick: 'Ricardo',
      age: 17,
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 5,
    };
    const usuario5: User = {
      nick: 'Marcos',
      age: 30,
      email: 'marcos@aoe.aoe',
      friend: false,
      uid: 6,
    };

    this.friends = [usuario1, usuario2, usuario3, usuario4, usuario5];

    this.friend = this.friends.find((record) => {
      return record.uid == this.friendId;
    });
    console.log('this.friend');
    console.log(this.friend);
  }

  ngOnInit(): void {}
}
