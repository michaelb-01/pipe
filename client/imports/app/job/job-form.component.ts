import { Component, Input } from '@angular/core';

import { NgForm }    from '@angular/forms';

import { Job } from "../../../../both/models/job.model";

import { JobService } from './job.service';

import { MeteorComponent } from 'angular2-meteor';

import template from './job-form.component.html';

declare var ObjectID : {
  _str:string
};

@Component({
  selector: 'job-form',
  providers: [JobService],
  template
})
export class JobFormComponent extends MeteorComponent  { 

  constructor(private _jobService: JobService) {
    super();
  }

  @Input() method: string;
  @Input() job: Job;

  onSubmit() {
    var newJob = {
      "name":this.job.name,
      "client":this.job.client,
      "agency":this.job.agency,
      "thumbUrl":this.job.thumbUrl,
      "public":this.job.public
    }

    if (this.method == 'Create') {
      this._jobService.createJob(this.job);
    } 
    else {
      this._jobService.editJob(this.job._id._str, newJob);
    }  
  }

  deleteJob() {
    this._jobService.deleteJob(this.job._id);

    this.call('deleteJob', this.job._id._str, function (err,res) {
      if (err) {
        console.log('ERROR:');
        console.log(err);
      }
      else {
        console.log(res);
      }  
    });
  }
}