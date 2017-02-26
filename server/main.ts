import { Meteor } from 'meteor/meteor';

//import { loadParties } from './imports/fixtures/parties';

import { createJobs } from './imports/fixtures/initialise_DB';
import { createUsers } from './imports/fixtures/initialise_DB';

import { Entities } from "../both/collections/entities.collection";
import { Todos } from "../both/collections/todos.collection";
import { Versions } from "../both/collections/versions.collection";

//import './imports/publications/parties';
import './imports/publications/jobs';  
import './imports/publications/entities';  
import './imports/publications/todos';  
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
    },

    deleteJob: function (id) {
      Entities.remove({"job.jobId":id});
      Versions.remove({"job.jobId":id});
    },

    findMyTodos(user) {
      console.log('main.ts - find my todos');
      return Todos.aggregate(
          { $match:{ "user":user } },
          { $group:{ _id:"$entity.name", todos:{ $push:"$$ROOT" } } },
          { $sort:{ "_id":1 } }
        );
    },

    addTodo(entityId,user,todo) {
      console.log(entityId);
      console.log(user);
      console.log(todo);

      Entities.update(
        { "_id": entityId, "todos.user": user},
        { $push: { "todos.$.todo": todo }}
      );
    },

    updateTodo(entityId,oldText,todo) {
      console.log('update todo');
      Entities.update({"_id":entityId,
                 "todos.text":oldText},
                 {$set:{"todos.$.text":todo.text,
                        "todos.$.done":todo.done}});
    }
  });

});
