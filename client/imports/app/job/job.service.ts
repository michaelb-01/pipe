import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { MeteorObservable } from 'meteor-rxjs';

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

  public createJob(job) {
    Jobs.insert(job);
  }

  public editJob(id, job) {
    console.log(job);

    Jobs.update({"_id": new Mongo.ObjectID(id)}, {$set:job} );
  }

  public deleteJob(id) {
    console.log(id);
    Jobs.remove({"_id": id});
  }
}
