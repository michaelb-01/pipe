import { Todos } from '../../../both/collections/todos.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("todos", function() {
  return Todos.find();
});

