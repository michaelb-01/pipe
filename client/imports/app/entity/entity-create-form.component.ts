import { Component, Input } from '@angular/core';
import { NgForm }    from '@angular/forms';

import { Job } from "../../../../both/models/job.model";

import { Entity } from "../../../../both/models/entity.model";
import { EntityService } from './entity.service';

import { MeteorComponent } from 'angular2-meteor';

import { MdDialog } from '@angular/material';

import jobGlobals = require('../../../../typings/site');

import template from './entity-create-form.component.html';

@Component({
  selector: 'entity-create-form',
  providers: [EntityService],
  template
})

export class EntityCreateFormComponent extends MeteorComponent  { 
  server: string;
  parentPath: string;

  borderStyle = 'dashed';

  types=['shot','asset'];

  constructor(private _entityService: EntityService) {
    super();
  }

  entity:Entity = {
    "job":{
      "jobId":"",
      "jobName":""
    },
    "name":"",
    "type":"shot",
    "tasks":[],
    "status":"Not Started",
    "thumbUrl":"",
    "description":"",
    "todos":[],
    "path":"",
    "public":true
  }

  shotNumber:string = '1';

  entities: Entity[] = [];

  job: Job;

  update(job,entities) {
    this.job = job;
    this.entities = entities;

    this.parentPath = job.path;

    this.entity.job = {
        "jobId":this.job._id.valueOf().toString(),
        "jobName":this.job.name
    };
  }

  onSubmit() {
    // update shot name
    if (this.entity.type == 'shot') {
      console.log('type is shot');
      this.entity.name = 'sh' + this.pad(this.shotNumber,3) + '0';
    }

    // check if entity already exists
    for (let i = 0; i < this.entities.length; i++) {
      console.log(this.entities[i].name);
      console.log(this.entity.name);
      if (this.entity.name == this.entities[i].name) {
        console.log('entity already exists');
        return;
      }
    }

    const path = this.parentPath + '/vfx/' + this.entity.type + 's/' + this.entity.name; 

    this.entity['path'] = path;

    this._entityService.createEntity(this.entity);

    //this.dialog.open(JobCreatedDialog);
  }

  shotUpdate(e) {

  }

  onDrop(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
    console.log('drop');
    console.log(event);
    console.log(event.dataTransfer.files[0]);
  }

  onDragOver(event) {
    event.preventDefault();
  }

  onDragEnd(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
    console.log('dropped');
  }

  onDragEnter(event) {
    event.preventDefault();
    this.borderStyle = 'solid';
  }

  onDragLeave(event) {
    event.preventDefault();
    this.borderStyle = 'dashed';
  }

  pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  }
}

