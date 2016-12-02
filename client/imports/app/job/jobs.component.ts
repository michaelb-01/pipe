import { Component } from '@angular/core';

import { Job } from "../../../../both/models/job.model";
import { Jobs } from "../../../../both/collections/jobs.collection";

import { MeteorComponent } from 'angular2-meteor';

import { JobService } from './job.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { MeteorObservable } from 'meteor-rxjs';

import { NgZone } from '@angular/core';

import template from './jobs.component.html';

@Component({
  selector: 'jobs',
  providers: [ JobService ],
  template
})

export class JobsComponent extends MeteorComponent {
  images = [];

  jobs: Observable<Job[]>;

  jobsSub: Subscription;

  constructor (private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.jobs = Jobs.find({}).zone().map((jobs: Array<any>) => {
      if (jobs) {
        var job,idx:any;

        jobs.forEach((job,idx) => {
          if (job.imageLoaded == true) {
            return;
          }
          this.readImageFile(idx, job.thumbUrl);
          job.imageLoaded = true;
        });
      }

      return jobs;
    });
    this.jobsSub = MeteorObservable.subscribe('jobs').subscribe();
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

