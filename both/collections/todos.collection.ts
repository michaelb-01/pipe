import { MongoObservable } from 'meteor-rxjs';

import { Todo } from '../models/todo.model';

export const Todos = new Mongo.Collection<Todo>('todos', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

Todos.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});