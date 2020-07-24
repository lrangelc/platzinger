import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    console.clear();
    this.friendId = this.activatedRoute.snapshot.params.uid;
    console.log('this.friendId');
    console.log(this.friendId);
    this.friend = userService.getFriend(this.friendId);
    console.log('this.friend');
    console.log(this.friend);
  }

  ngOnInit(): void {}
}
