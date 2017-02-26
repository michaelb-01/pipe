import { Entities } from '../../../both/collections/entities.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('entities', function(jobId: string) {
  return Entities.find(buildEntitiesQuery.call(this, jobId));
});

Meteor.publish('entity', function(entityId: string) {
  return Entities.find(buildEntityQuery.call(this, entityId));
});

function buildEntityQuery(entityId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (entityId) {
    return {
      // only single entity
      $and: [{
          _id: entityId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}

function buildEntitiesQuery(jobId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (jobId) {
    return {
      // only single entity
      $and: [{
          "job.jobId": jobId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}
