import { Jobs } from '../../../both/collections/jobs.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("jobs", function() {
  // return if job is public or current user is the owner
  const selector = {
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
 
  return Jobs.find(selector);
});