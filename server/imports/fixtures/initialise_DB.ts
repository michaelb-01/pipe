import { Job } from "../../../both/models/job.model";

import { Jobs } from '../../../both/collections/jobs.collection';
import { Entities } from '../../../both/collections/entities.collection';
import { Versions } from '../../../both/collections/versions.collection';

import { Mongo } from 'meteor/mongo';

var users = ['Mike Battcock', 'Mike Skrgatic', 'Ben Cantor', 'Sam Osbourne'];
var types = ['asset','shot'];
var images = ['/img/bmw.jpg','/img/clothes.jpg','/img/interior.jpg','/img/wallSmash.jpg','/img/warAndPeace.jpg','/img/willYoung.jpg'];
var videos = ['/video/dust_01.mov','/video/test.mov'];

function createVersion(jobId, jobName, entityId, entityName) {
  var maxNotes = 10;

  var notes = [];
  for (var i=0;i<Math.floor(Math.random() * maxNotes);i++) {
    notes.push({
      "author":{
        "id":'',
        "name":'Mike Battcock'
      },
      "body": Fake.sentence(Math.floor(Math.random() * 8))
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
    'version': Math.floor((Math.random() * 100) + 1),
    'notes': notes,
    'review': [],
    'contentType': contentType,
    'taskType': {
      'type': taskType,
      'idx': idx
    },
    'content': content,
    'description': Fake.sentence(7),
    'date': new Date(),
    'public': true
  }

  Versions.insert(version);
}

function createEntity(jobId, jobName) {
  console.log('create entity in ' + jobId);

  var taskTypes = ['fx','model','light','comp','texture','track'];
  var tasks = [];

  for (var i=0;i<Math.floor(Math.random() * taskTypes.length);i++) {
    var taskUsers = [];
    for (var j=0;j<Math.floor(users.length);j++) {
      if (Math.random() > 0.5) {
        taskUsers.push({"name":users[j]}); 
      }
    }
    tasks.push({
      "type":taskTypes[i],
      "users":taskUsers
    });
  }

  var statusTypes = ['active', 'not started', 'completed'];

  var entityId = new Mongo.ObjectID();

  var entity = {
    '_id': entityId,
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'name': Fake.sentence(1),
    'type': types[Math.floor((Math.random() * types.length))],
    'tasks': tasks,
    'status': 'active',
    'thumbUrl': images[Math.floor((Math.random() * images.length))],
    'description': Fake.sentence(7),
    'public': true
  }

  Entities.insert(entity);

  // random integer between 1 and 10
  var numVersions = Math.floor((Math.random() * 10) + 1);

  // create entities in job
  for (var i = 0; i < numVersions; i++) {
    createVersion(jobId, jobName, entityId._str, entity.name);
  }
} 
 
export function createJobs() {
  if (Versions.find().cursor.count() === 0) {
    console.log('load default jobs');

    const jobs: Job[] = [
      /*
      {
        'name': 'X-World',
        'client': 'BMW',
        'agency': 'Radical',
        'thumbUrl': 'bmw.jpg',
        'public': true
      },
      {
        'name': 'What The World Needs Now is Love',
        'client': 'Will Young',
        'agency': 'WWF',
        'thumbUrl': 'willYoung.jpg',
        'public': true
      },
      */
      {
        'name': 'War and Peace',
        'client': 'BBC',
        'agency': 'Someone',
        'thumbUrl': '/Users/michaelbattcock/Desktop/test.jpg',
        'public': true
      },
      {
        'name': 'Test Name',
        'client': 'Test Client',
        'agency': 'Test Agency',
        'thumbUrl': '/Users/michaelbattcock/Desktop/test_low.jpg',
        'public': true
      }
    ];

    console.log('loaded the following jobs:');

    var jobId = '';
    var numEntities = 1;

    for (var i = 0; i < jobs.length; i++) {
      var objectId = new Mongo.ObjectID();

      jobs[i]._id = objectId; // remove _str for mongo style id generation

      this.jobId = Jobs.insert(jobs[i]);

      console.log(objectId);

      // random integer between 1 and 10
      numEntities = Math.floor((Math.random() * 10) + 1);

      // create entities in job
      for (var j = 0; j < numEntities; j++) {
        createEntity(objectId._str, jobs[i].name);
      }
    }
  }
  else {
    console.log('found jobs already in database');
  }
}
