import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from './todo.model';

@Pipe({ name: 'todoFilter', pure: false })
export class TodoFilterPipe implements PipeTransform {
    transform(todos: Todo[], todoFilter: number): Todo[] {
        if (todoFilter === 0) {
          return todos;
        }
        else if (todoFilter === 1) {
          return _.filter(todos, (t: Todo) => !t.done);
        }
        else if (todoFilter === 2) {
          return _.filter(todos, (t: Todo) => t.done);
        }
    }
}