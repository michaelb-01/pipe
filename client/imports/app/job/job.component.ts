import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';

import { MeteorObservable } from 'meteor-rxjs';

import { Job } from "../../../../both/models/job.model";
import { Entity } from "../../../../both/models/entity.model";
import { Action } from "../../../../both/models/action.model";

import { JobService } from './job.service';
import { EntityService } from '../entity/entity.service';

import template from './job.component.html';

@Component({
  selector: 'job',
  providers: [JobService,
              EntityService],
  template
})

export class JobComponent implements OnInit, OnDestroy {
  @ViewChild('entityCreateForm') entityCreateForm;

  paramsSub: Subscription;

  jobSub: Subscription;
  jobId: string;
  job: Job;

  activitySub: Subscription;
  activity: Observable<Action[]>;

  // ENTITIES
  entitiesSub: Subscription;
  entities: Observable<Entity[]>;

  assets: Entity[] = [];
  shots: Entity[] = [];

  method:string;

  sidebarClosed = true;

  constructor( private route: ActivatedRoute,
               private _jobService: JobService,
               private _entityService: EntityService ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        this.jobId = jobId;

        if (this.jobSub) {
          this.jobSub.unsubscribe();
        }
        if (this.activitySub) {
          this.activitySub.unsubscribe();
        }

        this.jobSub = MeteorObservable.subscribe('job', this.jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.job = this._jobService.getJobById(jobId);
          });
        });

        // this.activitySub = MeteorObservable.subscribe('activity').subscribe(() => {
        //   MeteorObservable.autorun().subscribe(() => {
        //     this.activity = this._jobService.getJobActivity(jobId);
        //   });
        // });

        this.entitiesSub = MeteorObservable.subscribe('entities', this.jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {

            this._entityService.findEntities(jobId,'asset').subscribe(entities => {
              this.assets = entities;
            });

            this._entityService.findEntities(jobId,'shot').subscribe(entities => {
              this.shots = entities;
            });

            if (!this.entities) return;
          });
        });

      });
  }

  addEntity() {
    this.method = 'Create';

    this.sidebarClosed = false;

    this.entityCreateForm.update(this.job,this.assets.concat(this.shots));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.jobSub.unsubscribe();
  }
}
