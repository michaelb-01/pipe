import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'typeFilter' })
export class TypeFilterPipe implements PipeTransform {
  transform(value:any, types:[string[]]) {
    if (value == null) {
      return null;
    }

    var str, index;

    return value.filter(item => {
        str = JSON.stringify(item);

        index = types.indexOf(item.taskType.type);

        if (index > -1) {
          return true;
        }
        else {
          return null;
        }
    });
  }
}
