import {Pipe} from '@angular/core';

@Pipe({
    name: 'timeAgo'
})
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

      // format string
      if (delta < 10)
      {
          result = 'now';
      }
      else if (delta < 60)
      { // sent in last minute
          result = Math.floor(delta) + ' Seconds ago';
      }
      else if (delta < 3600)
      { // sent in last hour
          result = Math.floor(delta / 60) + ' Minutes ago';
      }
      else if (delta < 86400)
      { // sent on last day
          result = Math.floor(delta / 3600) + ' Hours ago';
      }
      else
      { // sent more than one day ago
          result = Math.floor(delta / 86400) + ' Weeks ago';
      }
      return result;
    }
}