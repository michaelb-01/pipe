import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, args) {
    if (!args) {
      return value;
    } else if (value) {

      return value.filter(item => {
          var str = JSON.stringify(item);
          //console.log(JSON.stringify(item));

          //console.log(str);

          if (str.toLowerCase().indexOf(args.toString().toLowerCase()) !== -1) {
            //console.log('found ' + args + ' in ' + + value[0].name);
            return true;
          }
      });
      /*
      return value.filter(item => {
        //console.log(item.name);
        for (let key in item) {
          console.log('looping through ' + key + ' in ' + item.name);
          if (key == 'tasks') {
            console.log('SHOW TASKS');
            for (let task in item[key]) {
              //console.log('looping over ' + key[task] + ' in ' + item.name);
              console.log('task: ' + task);
              for (let user in value[0].tasks[task].users) {
                var username = value[0].tasks[task].users[user].name;
                //console.log('checking for ' + username + ' in ' + item.name);
                if (username.toString().toLowerCase().indexOf(args.toString().toLowerCase()) !== -1) {
                  console.log('found ' + username + ' in ' + item[key]);
                  return true;
                }
              }
            }
          }
          else if (item[key].toString().toLowerCase().indexOf(args.toString().toLowerCase()) !== -1) {
            //console.log(item[key]);
            console.log(item[key] + ' contains ' + args);
            return true;
          }
        }
      });
      */
    }
  }
}