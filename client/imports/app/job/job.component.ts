import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';

import { MeteorObservable } from 'meteor-rxjs';

import { Job } from "../../../../both/models/job.model";

import { JobService } from './job.service';

import template from './job.component.html';

@Component({
  selector: 'job',
  providers: [JobService],
  template
})

export class JobComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;

  jobSub: Subscription;
  jobId: string;
  job: Job;

  constructor( private route: ActivatedRoute,
               private _jobService: JobService ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        this.jobId = jobId;

        if (this.jobSub) {
          this.jobSub.unsubscribe();
        }

        this.jobSub = MeteorObservable.subscribe('jobs', this.jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.job = this._jobService.getJobById(jobId);
          });
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.jobSub.unsubscribe();
  }
}
