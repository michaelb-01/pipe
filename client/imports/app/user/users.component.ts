import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PipeUser } from '../../../../both/models/user.model';
import { PipeUsers } from '../../../../both/collections/users.collection';

import { Observable } from 'rxjs/Observable';

import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { UserService } from './user.service';

import template from './users.component.html';

@Component({
  selector: 'users',
  providers: [ UserService ],
  template
})

export class UsersComponent {
  usersSub: Subscription;
  users: Observable<Array<PipeUser>>;
  userId: string;

  constructor(private route: ActivatedRoute,
              private _userService: UserService ) {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('pipeUsers').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.users = this._userService.findUsers();
      });
    });
  }
}

