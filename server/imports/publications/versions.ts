import { Versions } from '../../../both/collections/versions.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('versions', function(entityId: string) {
  return Versions.find(buildVersionsQuery.call(this, entityId));
});
 
Meteor.publish('version', function(versionId: string) {
  return Versions.find(buildVersionQuery.call(this, versionId));
});

function buildVersionsQuery (entityId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (entityId) {
    return {
      // only single entity
      $and: [{
          "entity.entityId": entityId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}

function buildVersionQuery(versionId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (versionId) {
    return {
      // only single entity
      $and: [{
          _id: versionId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}
