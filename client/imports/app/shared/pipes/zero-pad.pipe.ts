import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zeroPad' })
export class ZeroPadPipe implements PipeTransform {
  transform(n: any, width:number, z:any) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;  
  }
}
