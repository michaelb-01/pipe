import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstLetter' })
export class FirstLetterPipe implements PipeTransform {
  transform(value: any, args) {
    // if value is not a string just return it
    if (typeof value !== 'string') {
      return value;
    }
    var matches = value.match(/\b(\w)/g); 
    return matches.join('');  
  }
}
