import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { MeteorObservable } from 'meteor-rxjs';
import { MeteorComponent } from 'angular2-meteor';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Todo } from "../../../../both/models/todo.model";
import { Todos } from "../../../../both/collections/todos.collection";

function bin2string(array){
  var result = "";
  for(var i = 0; i < array.length; ++i){
    result+= (String.fromCharCode(array[i]));
  }
  return result;
}

@Injectable()
export class TodoService extends MeteorComponent{
  todos: Mongo.Cursor<Todo>;
  todos$ = new BehaviorSubject<Mongo.Cursor<Todo>>(null);

  subscription: any;

  constructor() {
    super();
    this.todos = Todos.find({});
    //MeteorObservable.subscribe("todos").subscribe();
  }

  findMyTodos(user) :Observable<Array<Todo>> { 
    console.log('todo service - find my todos');

    //return Meteor.call('findMyTodos',user);

    this.subscription = this.subscribe('todos', () => {
      console.log('todo service - subscribe');

      this.todos$.next(Meteor.call('findMyTodos',user,function (err, res) {
          if (res) {
              console.log(res);
          } else if (err) {
              console.log(err);
          }
      }));
    }, true); // set autoBind to true to auto-update Angular
  }

  public updateTodoText(todoId,text) {
    Todos.update({"_id":todoId},{$set:{"text":text}});

    //db.entities.update({"name":"I.","todos.text":"Mike's first todo"},{$set:{"todos.$.text":"Mike's updated todo"}});
  }

  public updateTodoDone(todoId,done) {
    console.log('update todo done');
    console.log(todoId);
    console.log(done);
    console.log(btoa(todoId.id));
    //Todos.update({"_id":todoId},{done:done},{ upsert: true });

    //db.entities.update({"name":"I.","todos.text":"Mike's first todo"},{$set:{"todos.$.text":"Mike's updated todo"}});
  }

}

