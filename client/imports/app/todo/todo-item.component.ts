import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Todo } from "./todo.model";

import { EntityService } from '../entity/entity.service';
import { TodoService } from './todo.service';

import template from './todo-item.component.html';

@Component({
  selector: 'todo-item',
  host: {
    '(document:click)': 'onClick($event)',
  },
  template
})

export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @Input() entityId: string;

  @Output() deleteTodo = new EventEmitter<Todo>();
  @Output() updateProgress = new EventEmitter();

  @ViewChild('todoInput') todoInput;
  @ViewChild('todoToggle') todoToggle;
  @ViewChild('todoText') todoText;

  todoList: Todo[];

  editMode: boolean = false;
  originalText: string;

  constructor(private changeDetector:ChangeDetectorRef,
              private _entityService: EntityService,
              private _todoService: TodoService){}

  ngOnInit() {}

  onClick(e: any) {
    if (this.todoText.nativeElement.contains(e.target)) {
      this.enableEditMode();
      this.originalText = this.todo.text;
    }
    else {
      this.editMode = false;
    }
  }

  enableEditMode() {
    this.editMode = true;

    // force change detection since the input was originally hidden
    // so the select() function wouldn't work
    this.changeDetector.detectChanges();  

    this.todoInput.nativeElement.select();
    //this.todoInput.nativeElement.setSelectionRange(0, this.todoInput.nativeElement.value.length);
  }

  onKeyUp(e: any) {
    if (e.keyCode === 13 && this.todo.text) {
        this.editMode = false;
        this.updateTodo();
    }
  }

  updateTodo() {
    this._todoService.updateTodoText(this.todo._id,this.todo.text);
  }

  deleteButtonClicked() {
     this._todoService.deleteTodo(this.todo._id);
    //this.deleteTodo.emit(this.todo);
  }

  onToggle(e: any) {
    this._todoService.updateTodoDone(this.todo._id, this.todo.done);
    this.updateProgress.emit();
  } 
}