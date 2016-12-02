import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Job } from "../../../../both/models/job.model";
import { Jobs } from "../../../../both/collections/jobs.collection";

import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { JobService } from './job.service';

import template from './jobs.component.html';

@Component({
  selector: 'jobs',
  providers: [ JobService ],
  template
})

export class JobsComponent implements OnInit, OnDestroy {
  jobs : Observable<Job[]>;
  jobsSub: Subscription;

  constructor (private _jobService: JobService) {

  }

  ngOnInit() {
    this.jobs = Jobs.find({}).zone();
    this.jobsSub = MeteorObservable.subscribe('jobs').subscribe();
  }

  ngOnDestroy() {
    this.jobsSub.unsubscribe();
  }

/*
  readTextFile() {
    var url = '/Users/michaelbattcock/Desktop/test.txt';

    this.call("readTextFile",url,(e,result) => {
      console.log(result); // "hallo"
      this.text = result;
    })

  }

  writeTextFile() {
    var text = 'Hello World';
    var url = '/Users/michaelbattcock/Desktop/test.txt';

    Meteor.call('writeTextFile', url, text, function(err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Write text file success');
      }
    });
  }

  readImageFile() {
    var url = '/Users/michaelbattcock/Desktop/test.jpg';

    Meteor.call('readImageFile', url, function(err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('read image file success');
      }
    });
  }
  */
}

