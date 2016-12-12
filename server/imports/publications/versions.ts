import { Versions } from '../../../both/collections/versions.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('versions', function() {
  return Versions.find(buildQuery.call(this));
});
 
Meteor.publish('version', function(versionId: string) {
  return Versions.find(buildQuery.call(this, versionId));
});

function buildQuery(versionId?: string): Object {
  // return if version is public or current user is the owner
  const isAvailable = {
    $or: [{
      public: true
    },
    { 
      $and: [{
        owner: this.userId 
      }, {
        owner: {
          $exists: true
        }
      }]
    }]
  };
 
  if (versionId) {
    return {
      // only single version
      $and: [{
          _id: versionId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}