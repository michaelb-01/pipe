import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Todo } from "./todo.model";

import { EntityService } from '../entity/entity.service';

import template from './todo-list.component.html';

@Component({
  selector: 'todo-list',
  template
})

export class TodoListComponent implements OnInit {
  @Input() todosTitle: string;
  @Input() todos: Todo[];
  @Input() entityId: string;

  numCompleted: number;

  filter:number = 0;
  filterColour: string = '#000';

  user: string = 'Mike Battcock';

  newTodo: Todo;

  constructor(private _entityService: EntityService) {}

  ngOnInit() {
    // filter only current user
    this.todos = this.todos.filter(todo=>{
      if (todo.user == this.user) {
        return true;
      }
    });

    this.resetNewTodo();
    this.updateProgress();
  }

  filterTodos(e: any) {
    if (e.shiftKey) {
      this.filter = 2;
      this.filterColour = '#ff0d0d';
    }
    else if (this.filter == 0) {
      this.filter = 1;
      this.filterColour = '#009688';
    }
    else {
      this.filter = 0;
      this.filterColour = '#000';
    }
  }

  resetNewTodo() {
    this.newTodo = {
      "entity":{
        "id":this.entityId,
        "name":this.todosTitle
      },
      "user":this.user,
      "text":"",
      "done":false
    };
  }

  deleteTodo(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index !== -1) {
        this.todos.splice(index, 1);
    }
  }

  addNewTodo() {
    if (this.newTodo.text) {
      console.log(this.newTodo);
      return;
      this._todoService.addTodo(this.newTodo);

      this.resetNewTodo();
    }
  }

  updateProgress() {
    this.numCompleted = this.todos.filter(
      todo => todo.done === true
    ).length;
  }
}