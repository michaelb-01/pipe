import { Todo } from '../../../both/collections/todos.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish('todos', function() {
  return Jobs.find(buildQuery.call(this));
});

Meteor.publish('todo', function(todoId: string) {
  return Jobs.find(buildQuery.call(this, todoId));
});

function buildQuery(todoId?: string): Object {
  const isAvailable = {
    $or: [{
      public: true
    }]
  };
 
  if (todoId) {
    return {
      // only single party
      $and: [{
          _id: todoId
        },
        isAvailable
      ]
    };
  }
 
  return isAvailable;
}