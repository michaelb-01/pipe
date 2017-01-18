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

        console.log(task);

        task.users.forEach(user=>{
          console.log(user);
          if (user == matchUser) {
            found = 1;
          }
        });

        console.log(found);

        if (found == 1) {
          return true;
        }
        else {
          return null;
        }
      });
  }
}
