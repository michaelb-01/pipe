import { IJob, Job } from "../../../both/models/job.model";

import { Jobs } from '../../../both/collections/jobs.collection';
import { Entities } from '../../../both/collections/entities.collection';
import { Versions } from '../../../both/collections/versions.collection';
import { PipeUsers } from '../../../both/collections/users.collection';
import { Activity } from '../../../both/collections/activity.collection';

import { Mongo } from 'meteor/mongo';

declare var Fake: any;

const users = ['Mike Battcock', 'Mike Skrgatic', 'Ben Cantor', 'Sam Osbourne'];
const types = ['asset','shot'];
const jobImages = ['audi','bmw','kittiwakes','liquid','nike','vw'];
const images = ['audi','audi_breakdown','bmw','dust_01','flip','kittiwakes','liquid','nike','test','vw'];
const videos = ['/video/dust_01.mov','/video/test.mov'];

function numberGen()
{
  var text = "0";
  
  var charset = "0123456789";
  
  for( var i=0; i < 4; i++ ) {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  text += ' ';

  for( var i=0; i < 5; i++ ) {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
}

export function createUsers() {
  if (PipeUsers.find().cursor.count() === 0) {
    console.log('load default users');
    for (var i = 0; i < users.length; i++) {
      var user = {
        'name': users[i],
        'email':'email@gmail.com',
        'phone':numberGen(),
        'public':true
      }
      PipeUsers.insert(user);
    }
  }
}

function createVersion(jobId, jobName, entityId, entityName) {
  var maxNotes = 10;

  var notes = [];
  for (var i=0;i<Math.floor(Math.random() * maxNotes);i++) {
    notes.push({
      "author":{
        "id":'',
        "name":'Mike Battcock'
      },
      "body": Fake.sentence(Math.floor(Math.random() * 8)),
      "date": new Date()
    });
  }

  var contentType = 'still';
  var content = images[Math.floor((Math.random() * images.length))];

  // make half videos
  if (Math.random() > 0.5) {
    contentType = 'video';
    content = videos[Math.floor((Math.random() * videos.length))];
  }

  var taskTypes = ['fx','model','light','comp','texture','track'];
  var taskType = taskTypes[Math.floor((Math.random() * taskTypes.length))];

  var idx = Versions.find( { $and: [{'entity.entityId':entityId}, {'taskType.type':taskType}] } ).cursor.count();

  console.log('found ' + idx + ' versions with type: ' + taskType);

  var versionId = new Mongo.ObjectID();

  console.log('version task: ' + versionId);

  var versionNum = Math.floor((Math.random() * 100) + 1)

  var version = {
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'entity': {
      'entityId': entityId,
      'entityName': entityName
    },
    'author': 'Mike Battcock',
    'version': versionNum,
    'notes': notes,
    'review': [],
    'contentType': contentType,
    'taskType': {
      'type': taskType,
      'idx': idx
    },
    'content': content,
    'thumbUrl': '/img/' + images[Math.floor((Math.random() * images.length))] + '_sprites.jpg',
    'description': Fake.sentence(7),
    'date': new Date(),
    'public': true
  }

  Versions.insert(version);

  var action = {
    'author':{
      'id':'',
      'name':'Mike Battcock'
    },
    'meta':{
      'name':versionNum.toString(),
      'type':'version',
      'jobId':jobId
    },
    'date': new Date,
    'public': true
  };

  Activity.insert(action);
}


function createEntity(jobId, jobName) {
  console.log('create entity in ' + jobId);

  var taskTypes = ['fx','model','light','comp','texture','track'];
  var tasks = [];

  for (var i=0;i<Math.floor(Math.random() * taskTypes.length);i++) {
    var taskUsers = [];
    for (var j=0;j<Math.floor(users.length);j++) {
      if (Math.random() > 0.5) {
        taskUsers.push(users[j]); 
      }
    }
    tasks.push({
      "_id":new Mongo.ObjectID(),
      "type":taskTypes[i],
      "users":taskUsers,
      "done":false
    });
  }

  var statusTypes = ['active', 'not started', 'completed'];

  var entityId = new Mongo.ObjectID();

  var name = Fake.sentence(1);

  var entity = {
    '_id': entityId,
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'name': name,
    'type': types[Math.floor((Math.random() * types.length))],
    'tasks': tasks,
    'status': 'active',
    'todos':[],
    'thumbUrl': '/img/' + images[Math.floor((Math.random() * images.length))] + '_sprites.jpg',
    'description': Fake.sentence(7),
    'public': true
  }

  Entities.insert(entity);

  var action = {
    'author':{
      'id':'',
      'name':'Mike Battcock'
    },
    'meta':{
      'name':name,
      'type':'entity',
      'jobId':jobId
    },
    'date': new Date,
    'public': true
  };

  Activity.insert(action);

  // random integer between 1 and 10
  var numVersions = Math.floor((Math.random() * 10) + 1);

  // create entities in job
  for (var i = 0; i < numVersions; i++) {
    createVersion(jobId, jobName, entityId.valueOf(), entity.name);
  }
} 
 
export function createJobs() {
  if (Versions.find().cursor.count() === 0) {
    console.log('load default jobs');

    const jobs: Job[] = [];

    let job = new Job();

    job.name = 'Sneakerboots';
    job.client = 'Nike';
    job.agency = 'More and More';
    job.thumbUrl = '/img/nike_sprites_9600.jpg';
    job.public = true;

    jobs.push(job);

    let job2 = new Job();

    job2.name = 'Service';
    job2.client = 'Audi';
    job2.agency = 'Radical';
    job2.thumbUrl = '/img/audi_sprites_9600.jpg';
    job2.public = true;

    jobs.push(job2);

    let jobId = '';
    let numEntities = 4;

    for (var i = 0; i < jobs.length; i++) {
      let objectId = new Mongo.ObjectID();

      jobs[i]._id = objectId; // remove valueOf() for mongo style id generation

      this.jobId = Jobs.insert(jobs[i]);

      // random integer between 1 and 10
      numEntities = Math.floor((Math.random() * 10) + 1);

      // create entities in job
      for (var j = 0; j < numEntities; j++) {
        createEntity(objectId.valueOf(), jobs[i].name);
      }
    }
  }
  else {
    console.log('found jobs already in database');
  }
}

