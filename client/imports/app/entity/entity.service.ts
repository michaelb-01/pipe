import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { Mongo } from 'meteor/mongo';

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

  public getJobEntities(jobId) : Observable<Entity[]> {
    return Entities.find({ "job.jobId":jobId });
  }

  public getEntityById(entityId) : Entity {
    return Entities.findOne({"_id": new Mongo.ObjectID(entityId)});
  }

  public findMyTasks(user) : Observable<Entity[]> {
    return Entities.find({ "tasks.users.name": user });
  }

  public assignUser(entityId, taskNum, userName) {
    var modifier = { $push: {} };
    modifier.$push['tasks.' + taskNum + '.users'] = { "name":userName };

    Entities.update( { "_id": entityId}, modifier );
  }

  public unassignUser(entityId, taskNum, userName) {
    var modifier = { $pull: {} };
    modifier.$pull['tasks.' + taskNum + '.users'] = { "name":userName };

    Entities.update( { "_id": entityId}, modifier );
  }
}

