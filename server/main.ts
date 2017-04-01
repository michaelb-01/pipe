import { Meteor } from 'meteor/meteor';

//import { loadParties } from './imports/fixtures/parties';

import { createJobs } from './imports/fixtures/initialise_DB';
import { createUsers } from './imports/fixtures/initialise_DB';

import { Entities } from "../both/collections/entities.collection";
import { Versions } from "../both/collections/versions.collection";

//import './imports/publications/parties';
import './imports/publications/jobs';  
import './imports/publications/entities';  
import './imports/publications/versions';  
import './imports/publications/users';  
import './imports/publications/activity';  

//import jobGlobals = require('../typings/site');
let jobGlobals = {
  'jobStructure':'',
  'shotStructure':''
}

//import * as fs from "fs";
import fs = require('fs');

import mkdirp = require('mkdirp');

//import Desktop = require('meteor-desktop/dist/desktop.js');

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function buildTree(obj,parent) {
  for (var key in obj) {
    mkdirp(parent + key, function (err) {
        if (err) {
          console.error(err)
        }
        //else { console.log('success'); }
    });
  
    if (typeof obj[key] == "object") {
      buildTree(obj[key],parent+key+'/');
    }
  }
}

function buildShots(job,numShots) {
  const shotPath = job.path + '/vfx/shots/';

  for (var i = 1; i <= numShots; i++) {
    var name = 'sh' + pad(i,3) + '0';
    var path = shotPath + name;

    // make shot directory
    mkdirp(shotPath + name);

    var entity = {
      "job":{
        "jobId":job._id._str,
        "jobName":job.name
      },
      "name":name,
      "type":"shot",
      "status":"Not Started",
      "thumbUrl":"",
      "description":"",
      "todos":[],
      "tasks":[],
      "path":path,
      "public":job.public
    };

    // build shot structure 
    buildTree(jobGlobals.shotStructure,path+'/');

    Entities.insert(entity);
  }
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

Meteor.startup(() => {
  createJobs();
  createUsers();

  Accounts.onLogin(function(user){
    console.log('logged in!!');
  });

  Meteor.methods({    

    createJob: function(job, numShots) {
      buildTree(jobGlobals.jobStructure,job.path+'/');

      buildShots(job,numShots);

      // if (Meteor.isDesktop) {
      //   console.log('desktop notification');
      //   Desktop.send('systemNotifications', 'notify', {
      //       title: 'Title',
      //       text: 'Text'
      //   });
      // }
    },

    createEntity: function(entity) {
      buildTree(jobGlobals.shotStructure,entity.path+'/');

      //if (Meteor.isDesktop) {
        // console.log('desktop notification');
        //   Desktop.send('systemNotifications', 'notify', {
        //       title: 'Title',
        //       text: 'Text',
        //       data: {
        //           someVar: 'someValue',
        //       }
        //   });
      //}
    },

    renameFolder: function(oldPath, newPath) {
      fs.rename(oldPath, newPath, function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });
    },

    deleteJob: function (job) {
      Entities.remove({"job.jobId":job._id.valueOf()});
      Versions.remove({"job.jobId":job._id.valueOf()});

      deleteFolderRecursive(job.path);

      // find parent folder (agency)
      // if its empty after deleting the job then we might as well delete the agency folder too..
      let parentFolder = job.path.split('/').slice(0, -1).join("/")+"/";

      fs.readdir(parentFolder, function(err, files) {
          if (err) {
             // some sort of error
          } else {
             if (!files.length) {
                 // directory appears to be empty
                 fs.rmdirSync(parentFolder);
             }
          }
      });
    },

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

    addTodo(entityId,user,todo) {
      console.log(entityId);
      console.log(user);
      console.log(todo);

      Entities.update(
        { "_id": entityId, "todos.user": user},
        { $push: { "todos.$.todo": todo }}
      );
    },

    updateTodo(entityId,todo) {
      Entities.update({"_id":entityId,
                 "todos._id":todo._id},
                 {$set:{"todos.$.text":todo.text,
                        "todos.$.done":todo.done}});
    },

    deleteTodo(entityId,todo) {
      Entities.update(
        { "_id": entityId },
        { $pull: { "todos": { "_id": todo._id } } }
      );
    }
  });

});
