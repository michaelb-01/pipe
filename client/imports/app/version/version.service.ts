import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { MeteorObservable } from 'meteor-rxjs';

import { Version } from "../../../../both/models/version.model";
import { Versions } from "../../../../both/collections/versions.collection";

@Injectable()
export class VersionService {
  private versions : Observable<Version[]>;
  private version : Observable<Version>;

  constructor() {
    this.versions = Versions.find({});
    MeteorObservable.subscribe("versions").subscribe();
  }

  public getVersions(entityId) : Observable<Version[]> {
    console.log('version service: get versions for entity with id: ' + entityId);
    return Versions.find({"entity.entityId": entityId});
  }

  public getVersionById(versionId) : Observable<Version> {
    console.log('get version with id: ' + versionId);
    return Versions.findOne({"_id": new Mongo.ObjectID(versionId)});
  }

  public getNextVersion(entityId, versionNum) {
    return Versions.findOne({
      $and : [
        { "entity.entityId":entityId},
        { "version":{$gt:versionNum}}
      ]
    }, {sort: {"version":1}});
  }

  public getPrevVersion(entityId, versionNum) {
    return Versions.findOne({
      $and : [
        { "entity.entityId":entityId},
        { "version":{$lt:versionNum}}
      ]
    }, {sort: {"version":-1}});
  }

  addReview(versionId, review) {
    console.log(new Mongo.ObjectID(versionId));
    console.log(review);

    Versions.update({"_id":new Mongo.ObjectID(versionId) },{$push : {"review":review}});
  }

  addStroke(versionId, frame, stroke, idx) {
    console.log('add stroke');

    if (idx > -1) {
      console.log('index is -1');

      var modifier = { $push: {} };
      modifier.$push['review.' + idx + '.strokes'] = stroke;

      Versions.update( { "_id": new Mongo.ObjectID(versionId)}, modifier );
    }
    else {
      var note = {
        "frame": frame,
        "comments": [],
        "strokes": [stroke]
      }

      Versions.update({"_id" : new Mongo.ObjectID(versionId) },{$push : {"review":note}});
    }
  }

  addComment(versionId, frame, comment, idx) {
    if (idx > -1) {
      //Versions.update({"_id" :versionId },{$push : {"review":note}});

      var modifier = { $push: {} };
      modifier.$push['review.' + idx + '.comments'] = comment;

      Versions.update( { "_id": new Mongo.ObjectID(versionId)}, modifier );
    }
    else {
      var note = {
        "frame": frame,
        "comments": [comment],
        "strokes": []
      }
      Versions.update({"_id" : new Mongo.ObjectID(versionId) },{$push : {"review":note}});
    }
  }

  deleteReview(versionId, date) {
    console.log(versionId);
    console.log(date);
    Versions.update(
      { "_id": new Mongo.ObjectID(versionId) },
      { $pull: { 'review': { date: new Date(date) } } }
    );
  }
}
