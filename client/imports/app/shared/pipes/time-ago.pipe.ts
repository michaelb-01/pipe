import {Pipe} from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe
{
    constructor() {}

    transform(value:any, args?:any[]):any
    {
      var result:string;

      // instantiate date string as a date object
      var date = new Date(value);

      // current time
      let now = new Date().getTime();

      // time since message was sent in seconds
      let delta = (now - date.getTime()) / 1000;

      var plural = '';

      var num:number;
      var unit:string = '';

      // format string
      if (delta < 60)
      { // sent in last minute
          num = Math.floor(delta);
          unit = 'Second';
      }
      else if (delta < 3600)
      { // sent in last hour
          num = Math.floor(delta / 60);
          unit = 'Minute';
      }
      else if (delta < 86400)
      { // sent on last day
          num = Math.floor(delta / 3600);
          unit = 'Hour';
      }
      else
      { // sent more than one day ago
          num = Math.floor(delta / 86400);
          unit = 'Week';
      }

      if (delta < 10) {
          result = 'now';
      }
      else {
        if (num > 1) {
          plural = 's';
        }

        result = num + ' ' + unit + plural + ' Ago';
      }

      return result;
    }
}