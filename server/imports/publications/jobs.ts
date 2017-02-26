import { Jobs } from '../../../both/collections/jobs.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('jobs', function() {
  return Jobs.find(buildQuery.call(this));
});

Meteor.publish('job', function(jobId: string) {
  return Jobs.find(buildQuery.call(this, jobId));
});

function buildQuery(jobId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (jobId) {
    return {
      // only single party
      $and: [{
          _id: jobId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}