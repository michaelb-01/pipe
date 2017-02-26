import { Pipe } from '@angular/core';

@Pipe({ name: "sort" })
export class SortPipe {
  transform(array: Array<any>, args: string): Array<any> {
    if (array == null) {
      return null;
    }
    array.sort((a: any, b: any) => {
      var query = 'date';

      if (args == 'date') {
        let start = +new Date(a.date);
        let result = +new Date(b.date) - start;
        return result;
      }

      var frame = 'frame';
      
      if (a[frame] < b[frame]) {
        return -1;
      //.completed because we want to sort the list by completed property
      } else if (a[frame] > b[frame]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}