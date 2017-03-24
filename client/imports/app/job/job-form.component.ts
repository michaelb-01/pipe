import { Component, Input } from '@angular/core';

import { NgForm }    from '@angular/forms';

import { IJob, Job } from "../../../../both/models/job.model";

import { JobService } from './job.service';

import { MeteorComponent } from 'angular2-meteor';

import jobGlobals = require('../../../../typings/site');
import cameras = require('../../../../typings/cameras');

import template from './job-form.component.html';

@Component({
  selector: 'job-form',
  providers: [JobService],
  template
})

export class JobFormComponent extends MeteorComponent  { 

  server: string;
  numShots: number = 20;

  cameras = cameras.cameras;

  selectedCamera: any = '';

  camerasFiltered: any = cameras.cameras;
  cameraFilter: string = '';

  selectedFormat: any = '';
  formatFilter: string = '';

  fps: number = 25;

  constructor(private _jobService: JobService) {
    super();
  }

  @Input() method: string;
  job: IJob;

  ngOnInit() {
    this.initialise();
  }

  ngOnChanges(changes: any) {
    // if (method) input changes and method is 'create' re-initialise values
    if (this.method == 'create') {
      this.initialise();
    } 
  }

  initialise() {
    this.job = new Job();
    this.selectedCamera = '';
    this.selectedFormat = '';
  }

  filterCameraList(val:string) {
    this.camerasFiltered = this.cameras.filter( camera => {
      if (camera.body.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
        return true;
      }
    });
  }

  selectCamera(camera) {
    this.job['camera'] = {
      'body':camera.body,
       'res':{
        'width':camera.formats[0].width,
        'height':camera.formats[0].height
      },
      'sensor':{
        'width':camera.formats[0].sensor.width,
        'height':camera.formats[0].sensor.height
      }
    }

    this.selectedCamera = camera;
  }

  selectFormat(format) {
    this.job['camera'] = {
      'body':this.selectedCamera.body,
      'res':{
        'width':format.width,
        'height':format.height
      },
      'sensor':{
        'width':format.sensor.width,
        'height':format.sensor.height
      }
    }
  }

  onSubmit() {
    const path = this.job.agency + '/' + this.job.client + '_' + this.job.name; 

    this.job['path'] = jobGlobals.jobRoots[0] + '/' + path;

    if (this.method == 'create') {
      this._jobService.createJob(this.job,this.numShots);
    } 
    else {
      this._jobService.editJob(this.job);
    }  
  }

  updateForm(job) {
    this.job = job;

    for (let i = 0; i < this.cameras.length; i++) {
      if (this.cameras[i].body == job.camera.body) {
        this.selectedCamera = this.cameras[i];
        break;
      }
    }
  } 

  deleteJob() {
    this._jobService.deleteJob(this.job._id);

    this.call('deleteJob', this.job, function (err,res) {
      if (err) {
        console.log(err);
      }
    });

    this.initialise();
  }

  numberUpdate(e) {
    //this.numShots = 7;// Math.max(this.numShots,1);
    console.log(this.numShots);
  }

  updateDropframe(dropframe) {
    if (dropframe._checked) {
      switch (this.job.output.fps) {
        case 24:
          this.job.output.fps = 23.976;
          break;
        case 30:
          this.job.output.fps = 29.97;
      }
    }
    else {
      this.job.output.fps = Math.ceil(this.job.output.fps);
    }
  }
}
