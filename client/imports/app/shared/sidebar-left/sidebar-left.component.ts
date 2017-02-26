import { Component, OnInit, OnDestroy } from '@angular/core';

import { Entity } from '../../../../../both/models/entity.model';
import { Entities } from '../../../../../both/collections/entities.collection';
import { EntityService } from '../../entity/entity.service';

import { Todo } from '../../../../../both/models/todo.model';
import { Todos } from '../../../../../both/collections/todos.collection';
import { TodoService } from '../../todo/todo.service';

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import template from './sidebar-left.component.html';

@Component({
  selector: 'sidebar-left',
  providers: [ EntityService,
               TodoService ],
  template
})

export class SidebarLeftComponent extends MeteorComponent implements OnInit, OnDestroy {
  myTasksSub: Subscription;
  myTasks: Entity[];

  myTodosSub: Subscription;

  user: string = 'Mike Battcock';

  myTodos: Mongo.Cursor<Todo>;
  subscription: any;

  selectedTab = 1;

  constructor(private _entityService: EntityService,
              private _todoService: TodoService) {
    super();
    // var source = Observable.interval(500).take(5);

    // var sub = source.groupBy(x=>x%2)
    //                 //.map(innerObs=>innerObs.count())
    //                 //.mergeAll()
    //                 .subscribe( x => {
    //                   console.log(x);
    //                 });

    if (Meteor.userId()) {
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

      // this.myTodosSub = MeteorObservable.subscribe('todos').subscribe(() => {
      //   MeteorObservable.autorun().subscribe(() => {
          
      //     // this._todoService.findMyTodos(this.user)
      //     //                  .throttleTime(10)
      //     //                  .mergeAll()
      //     //                  .groupBy(x=>x.done)
      //     //                  .subscribe(todos => {
      //     //                     console.log(todos);
      //     //                  });
      //   });
      // });
    }
  }

  groupTodos(todos) {
    console.log(todos);
    console.log(todos.length);
    var numbers = todos.map(function(todo) { console.log(todo); });

    return;
    
    todos.forEach(todo=>{
      console.log(todo.entity.name);
    })
  }

  findMyTodos() {
    this.myTasks.forEach(task=>{
      //console.log(task.todos);
    });
  }

  ngOnInit() {
    console.log('sidebar-left: find my todos');
    this.call('findMyTodos',this.user, (err, res) => {
      if (res) {
          this.myTodos = res;
          console.log(res);
      } else if (err) {
          console.log(err);
      }
    }, true);  // set `autoBind` to `true` here
  }

  showSidebarLeft = true;
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