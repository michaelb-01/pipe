import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { MeteorObservable } from 'meteor-rxjs';
import { MeteorComponent } from 'angular2-meteor';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Todo } from "../../../../both/models/todo.model";
import { Todos } from "../../../../both/collections/todos.collection";

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

  public addTodo(todo) {
    console.log(todo);
  }

  public updateTodoText(todoId,text) {
    const id = new Mongo.ObjectID(Buffer.from(todoId.id).toString('hex'));

    Todos.update({"_id":id},{$set:{"text":text}});

    //db.entities.update({"name":"I.","todos.text":"Mike's first todo"},{$set:{"todos.$.text":"Mike's updated todo"}});
  }

  public updateTodoDone(todoId,done) {
    const id = new Mongo.ObjectID(Buffer.from(todoId.id).toString('hex'));

    Todos.update({"_id":id},{$set:{"done":done}});

    //db.entities.update({"name":"I.","todos.text":"Mike's first todo"},{$set:{"todos.$.text":"Mike's updated todo"}});
  }

  public deleteTodo(todoId) {
    const id = new Mongo.ObjectID(Buffer.from(todoId.id).toString('hex'));

    Todos.remove({"_id":id});
  }

}

