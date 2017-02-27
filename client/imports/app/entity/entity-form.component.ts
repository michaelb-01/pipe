import 'reflect-metadata';
import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';

import { NgForm }    from '@angular/forms';

import { PipeUser } from "../../../../both/models/user.model";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { UserService } from '../user/user.service';

import { MeteorComponent } from 'angular2-meteor';

import template from './entity-form.component.html';

@Component({
  selector: 'entity-form',
  providers: [ UserService ],
  template
})
export class EntityFormComponent extends MeteorComponent { 
  usersSub: Subscription;

  users: Observable<PipeUser[]>;

  filteredUsers: any[] = [];
  selectedUsers: any[] = [];

  selectedUsersID: string;

  public query = '';

  constructor(private ngZone: NgZone,
              private _userService: UserService) {

    super();
  }

  @Input() action: string;
  @Input() sel;

  @Output() onAssign = new EventEmitter();

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('pipeUsers').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.users = this._userService.findUsers();
      });
    });
  }

  filterUsers() {
    this.filteredUsers = [];

    if (this.query !== '') {
      this.users.forEach((user) => {
        if (user.name.toString().toLowerCase().indexOf(this.query.toString().toLowerCase()) !== -1) {
        // begins with
        //if (user.name.toLowerCase().substring(0, this.query.length) == this.query.toLowerCase()) {
          let allowed = 1;

          this.selectedUsers.forEach((selectedUser) => {
            if (user._id == selectedUser._id) {
              allowed = 0;
            }
          });

          if (allowed == 1) {
            this.filteredUsers.push(user);
          }
        }
      });
    }
  }

  addUser(user) {
    var allowed = 1;

    this.selectedUsers.forEach((userCheck) => {
      if (user._id == userCheck._id) {
        allowed = 0;
      }
    });

    if (allowed) {
      this.selectedUsers.push(user.name);
    }
  }

  handleTab(event) {
    event.preventDefault();

    if (this.filteredUsers.length > 0) {
      this.addUser(this.filteredUsers[this.selectedItem]);
      this.selectedItem = 0;
    }

    this.query = '';
    this.filteredUsers = [];
  }

  clickUser(i) {
    if (this.filteredUsers.length > 0) {
      this.addUser(this.filteredUsers[i]);
      this.selectedItem = 0;
    }

    this.query = '';
    this.filteredUsers = [];
  }

  removeUser(index) {
    this.selectedUsers.splice(index,1);
    this.filterUsers();  // update filtered users
    document.getElementById("search-box-input").focus();  // set focus back to input
  }

  slide = false;
  slideCarousel(val) {
    this.slide = val;
  }

  selectedItem = 0;
  handleArrow(key) {
    //event.preventDefault();

    if (key == 40) {
      this.selectedItem = Math.min(this.selectedItem  + 1, this.filteredUsers.length);
    }
    else if (key == 38) {
      this.selectedItem = Math.max(this.selectedItem -1, 0);
    }
  }

  hoverUser(i) {
    this.selectedItem = i;
  }

  assign() {
    this.onAssign.emit({mode:true, users:this.selectedUsers});
  }

  unassign() {
    this.onAssign.emit({mode:false, users:this.selectedUsers});
  }
}