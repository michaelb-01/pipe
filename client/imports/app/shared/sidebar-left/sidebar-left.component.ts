import { Component } from '@angular/core';

import { Entity } from '../../../../../both/models/entity.model';
import { Entities } from '../../../../../both/collections/entities.collection';
import { EntityService } from '../../entity/entity.service';

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import template from './sidebar-left.component.html';

@Component({
  selector: 'sidebar-left',
  providers: [ EntityService ],
  template
})

export class SidebarLeftComponent {
  myTasksSub: Subscription;
  myTasks: Observable<Entity[]>;

  user: string = 'Mike Battcock'

  constructor(private _entityService: EntityService) {
    if (Meteor.userId()) {
      this.myTasksSub = MeteorObservable.subscribe('entities').subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {
          this.myTasks = this._entityService.findMyTasks(this.user);
        });
      });
    }
  }

  showSidebarLeft = false;
  toggleSidebarLeft(newState) {
    this.showSidebarLeft = newState;
    console.log('open left sidebar');
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
  }
}