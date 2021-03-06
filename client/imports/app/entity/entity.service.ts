import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { MeteorObservable } from 'meteor-rxjs';

import { Entity } from "../../../../both/models/entity.model";
import { Entities } from "../../../../both/collections/entities.collection";

@Injectable()
export class EntityService {
  private entities : Observable<Entity[]>;
  private entity : Observable<Entity>;

  constructor() {
    this.entities = Entities.find({});
    MeteorObservable.subscribe("entities").subscribe();
  }

  public findEntities(jobId,type) : Observable<Entity[]> {
    return Entities.find({$and:[{"job.jobId":jobId},{"type":type}]});
  }

  public getJobEntities(jobId) : Observable<Entity[]> {
    return Entities.find({ "job.jobId":jobId });
  }

  public getEntityById(entityId) : Entity {
    return Entities.findOne({"_id": new Mongo.ObjectID(entityId)});
  }

  public createEntity(entity) {
    Entities.insert(entity);

    Meteor.call('createEntity', entity);
  }

  public updateEntity(entity, oldPath) {
    let id = entity._id;

    delete entity._id;

    Entities.update({"_id": id}, { $set:entity } );

    if (oldPath) {
      Meteor.call('renameFolder', oldPath, entity.path);
    }
  }

  public findMyTasks(user) : Observable<Entity[]> {
    return Entities.find({ "tasks.users": user });
  }

  public unassignUser(entityId, taskNum, userName) {
    var modifier = { $pull: {} };
    modifier.$pull['tasks.' + taskNum + '.users'] = userName;

    Entities.update( { "_id": new Mongo.ObjectID(entityId)}, modifier );
  }

  public assignUser(entityId, taskNum, users) {
    var modifier = { $addToSet: {} };
    modifier.$addToSet['tasks.' + taskNum + '.users'] = { $each: users };

    Entities.update( { "_id": new Mongo.ObjectID(entityId)}, modifier );
  }

  public addTask(entitiyId, taskName) {
    var task = {
      '_id': new Mongo.ObjectID(),
      'type': taskName,
      'users':[]
    }

    Entities.update({"_id":entitiyId },{$push : {"tasks":task}});
  }

  public addTodo(entityId, todo) {
    todo['_id'] = new Mongo.ObjectID();

    Entities.update( { "_id": entityId},   
      { "$push": {"todos": todo } }
    );
  }

  public updateTodo(entityId,todo) {
    console.log(todo);
    Meteor.call('updateTodo', entityId, todo);

    //db.entities.update({"name":"I.","todos.text":"Mike's first todo"},{$set:{"todos.$.text":"Mike's updated todo"}});
  }

  public deleteTodo(entityId, todo) {
    Meteor.call('deleteTodo', entityId, todo);
  }
}

