import { Entities } from '../../../both/collections/entities.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("entities", function() {
  // return if entity is public or current user is the owner
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
 
  return Entities.find(selector);
});