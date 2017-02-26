import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from './todo.model';

@Pipe({ name: 'todoListFilter', pure: false })
export class TodoListFilterPipe implements PipeTransform {
    transform(todoList: any, nameFilter: string): Todo[] {
      return todoList.filter(list=>{
        if (list.user === nameFilter) {
          return true;
        }
      });
    }
}