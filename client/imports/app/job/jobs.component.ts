import { Component, ViewChild } from '@angular/core';

import { IJob, Job } from "../../../../both/models/job.model";
import { Jobs } from "../../../../both/collections/jobs.collection";

import { MeteorComponent } from 'angular2-meteor';

import { JobService } from './job.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { MeteorObservable } from 'meteor-rxjs';

import { NgZone } from '@angular/core';

import { ThumbnailComponent } from '../thumbnail/thumbnail.component'; 

import template from './jobs.component.html';

@Component({
  selector: 'jobs',
  providers: [ JobService ],
  template
})

export class JobsComponent extends MeteorComponent {

  @ViewChild('jobForm') jobForm;

  images = [];

  jobs: Observable<Job[]>;

  job: IJob = new Job();

  jobsSub: Subscription;

  originalJob: IJob;
  selectedJob: IJob;

  sidebarClosed = true;

  method: string = 'create';

  constructor (private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.jobs = Jobs.find({}).zone();

    this.jobsSub = MeteorObservable.subscribe('jobs').subscribe();
  }

  addJob() {
    this.method = 'create';
    this.sidebarClosed = false;
  }

  editJob(job) {
    this.method = 'Edit';
    this.job = job;
    this.sidebarClosed = false;
    this.jobForm.updateForm(job);

    this.originalJob = JSON.parse(JSON.stringify(job));
    this.selectedJob = job;
  }

  toggleSidebarRight(newState) {
    this.sidebarClosed = true;

    for (let key in this.originalJob) {
      this.selectedJob[key] = this.originalJob[key];
    } 
  }

  readTextFile() {
    var url = '/Users/michaelbattcock/Desktop/test.txt';

    this.call('readTextFile', url, function (err,res) {
      this.text = 'function';
      if (err) {
        console.log('ERROR:');
        console.log(err);
      }
      else {
        this.text = res;
        console.log(res);
      }  
    });
  }

  readImageFile(idx, url) {
    if (url) {
      this.call('readImageFile', url, (err, res) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log('read image file success');
          this.images[idx] = "data:image/jpg;base64," + res;
        }
      });
    }
    console.log(this.images);
  }

  writeTextFile() {
    var text = 'Hello World';
    var url = '/Users/michaelbattcock/Desktop/test.txt';

    this.call('writeTextFile', url, text, function(err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Write text file success');
      }
    });
  }
}

