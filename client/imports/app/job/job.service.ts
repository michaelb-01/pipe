import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Job } from "../../../../both/models/job.model";
import { Jobs } from "../../../../both/collections/jobs.collection";

import { Action } from "../../../../both/models/action.model";
import { Activity } from "../../../../both/collections/activity.collection";

@Injectable()
export class JobService {
  private jobs : Observable<Job[]>;
  private job : Observable<Job>;

  constructor() {
    this.jobs = Jobs.find({});
    MeteorObservable.subscribe("jobs").subscribe();
  }

  public getJobs() : Observable<Job[]> {
    return this.jobs;
  }

  public getJobById(jobId) : Job {
    return Jobs.findOne({"_id": new Mongo.ObjectID(jobId)});
  }

  public getJobActivity(jobId) : Observable<Action[]> {
    console.log('job id ' + jobId);
    return Activity.find({"meta.jobId": jobId},{limit:2});
  }

  public createJob(job,numShots) {
    // don't create if job already exists
    if (Jobs.find({'path':job.path}).cursor.count() > 0) {
      console.log('job alread exists');
      return;
    }

    var jobId = new Mongo.ObjectID();

    job['_id'] = jobId;

    Jobs.insert(job);

    Meteor.call('createJob', job, numShots);
  }

  public editJob(job) {
    let id = job._id;

    // need to duplicate the object. otherwise it is still linked to the jobs component so deleting the id will interfere...
    let editJob = JSON.parse(JSON.stringify(job));;

    delete editJob._id;

    Jobs.update({"_id": id}, {$set:editJob} );
  }

  public deleteJob(id) {
    Jobs.remove({"_id": id});
  }
}
