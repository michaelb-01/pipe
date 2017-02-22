import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'myTasksFilter' })
export class MyTasksFilterPipe implements PipeTransform {
  transform(value: any, matchUser) {

      if (value == null) {
        return null;
      }

      var found = 0;

      return value.filter(task => {
        found = 0;

        task.users.forEach(user=>{
          if (user == matchUser) {
            found = 1;
          }
        });

        if (found == 1) {
          return true;
        }
        else {
          return null;
        }
      });
  }
}
