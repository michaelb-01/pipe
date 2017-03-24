import { Component, OnInit, OnDestroy } from '@angular/core';

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

export class SidebarLeftComponent implements OnInit, OnDestroy {
  myTasksSub: Subscription;
  myTasks: Entity[];

  user: string = 'Mike Battcock';

  myTodos: any[];

  selectedTab = 1;

  constructor(private _entityService: EntityService) {
    //if (Meteor.userId()) {
      if (this.myTasksSub) {
        this.myTasksSub.unsubscribe();
      }

      this.myTasksSub = MeteorObservable.subscribe('entities').subscribe(() => {
        MeteorObservable.autorun().subscribe(() => {
          this._entityService.findMyTasks(this.user).subscribe(tasks => {
            this.myTasks = tasks;
          });
        });
      });
    //}
  }

  findMyTodos() {
    this.myTasks.forEach(task=>{
      //console.log(task.todos);
    });
  }

  ngOnInit() {
  }

  showSidebarLeft = false;
  toggleSidebarLeft(newState) {
    this.showSidebarLeft = newState;
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
  }

  selectTab(idx) {
    //this.myTasks = 
    this.selectedTab = idx;
  }

  deleteTodo(entityId,todo) {
    //this._entityService.deleteTodo(entity._id, todo);
  }

  ngOnDestroy() {
    this.myTasksSub.unsubscribe();
  }
}