import { Component, Input } from '@angular/core';

import { NgForm }    from '@angular/forms';

import { Job } from "../../../../both/models/job.model";

import { JobService } from './job.service';

import template from './job-form.component.html';

@Component({
  selector: 'job-form',
  providers: [JobService],
  template
})
export class JobFormComponent { 

  constructor(private _jobService: JobService) {
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
  }
}