import { Injectable } from '@angular/core';

import { PipeUser } from '../../../../both/models/user.model';
import { PipeUsers } from '../../../../both/collections/users.collection';

import { Observable } from "rxjs";

import { MeteorObservable } from 'meteor-rxjs';

@Injectable()
export class UserService {
  private pipeUsers : Observable<PipeUser[]>;

  constructor() {
    this.pipeUsers = PipeUsers.find({});
    MeteorObservable.subscribe("pipeUsers").subscribe();
  }

  public findUsers() : Observable<PipeUser[]> {
    return PipeUsers.find();
  }

}


