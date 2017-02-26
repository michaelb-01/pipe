import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { MeteorObservable } from 'meteor-rxjs';
import { MeteorComponent } from 'angular2-meteor';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Todo } from "../../../../both/models/todo.model";
import { Todos } from "../../../../both/collections/todos.collection";

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
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

}

