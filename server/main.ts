import { Meteor } from 'meteor/meteor';

//import { loadParties } from './imports/fixtures/parties';

import { createJobs } from './imports/fixtures/initialise_DB';
import { createUsers } from './imports/fixtures/initialise_DB';

//import './imports/publications/parties';
import './imports/publications/jobs';  
import './imports/publications/entities';  
import './imports/publications/versions';  
import './imports/publications/users';  
import './imports/publications/activity';  

import * as fs from "fs";

Meteor.startup(() => {
  createJobs();
  createUsers();

  Accounts.onLogin(function(user){
    console.log('logged in!!');
  });

  Meteor.methods({    
    readTextFile: function(url) {
      console.log('read file from: ' + url);

      var Future = Npm.require('fibers/future');
      var myFuture = new Future();

      fs.readFile(String(url),'utf-8', function read(error, result) {
        if(error){
          myFuture.throw(error);
        }else{
          myFuture.return(result);
        }
      });

      return myFuture.wait();
    },

    readImageFile: function(url) {
      console.log('read file from: ' + url);

      var Future = Npm.require('fibers/future');
      var myFuture = new Future();

      fs.readFile(String(url), function read(error, result) {
        if(error){
          myFuture.throw(error);
        }else{
          myFuture.return(new Buffer(result).toString('base64'));
        }
      });

      return myFuture.wait();
    },

    writeTextFile: function (url, text) {
      console.log('wrote ' + text + ' to ' + url);
      fs.writeFileSync(String(url), text);
    }

  });

});
