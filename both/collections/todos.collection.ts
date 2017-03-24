import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Todo } from '../models/todo.model';

export const Todos = new MongoObservable.Collection<Todo>('todos', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

Todos.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});