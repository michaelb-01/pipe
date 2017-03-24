import { Component, Input, ViewChild } from '@angular/core';

import { Entity } from "../../../../both/models/entity.model";
import { EntityService } from '../entity/entity.service';

import template from './entity-list.component.html';

@Component({
  selector: 'entity-list',
  template,
  styles: [`
    :host {
      position: relative;
      display: block;
    }
  `]
})

export class EntityListComponent {
  @Input() entities: Entity[];
  @Input() title: string;

  @ViewChild('entityForm') entityForm;

  sidebarClosed: boolean = true;

  selectedTasks: any = [];

  originalEntity: Entity;
  selectedEntity: Entity;

  showDetails: boolean = false;

  constructor(private _entityService: EntityService){}

  ngOnInit() {
    console.log(this.title);
  }

  showTasks() {
    this.showDetails = !this.showDetails;
  }

  selectEntity(entity) {
    this.sidebarClosed = false;

    this.entityForm.update(this.selectedTasks,entity);

    // hold last selected entity so we can reset it
    this.selectedEntity = entity;

    // create a duplicate to hold the values

    //this.originalEntity = Object.assign(Object.create(entity), entity);
    //this.originalEntity  = { ...entity };

    this.originalEntity = {
      'job': {
        'jobId': entity.job.jobId,
        'jobName': entity.job.jobName
      },
      'name': entity.name,
      'type': entity.type,
      'tasks': entity.tasks,
      'status': entity.status,
      'description': entity.description,
      'public': entity.public
    };
  }

  selectTask(obj) {
    let found = false;

    for (let i=0; i < this.selectedTasks.length; i++) {
      if (this.selectedTasks[i].entity.name == obj.entity.name) {
        if (this.selectedTasks[i].task.type == obj.task.type) {
          this.selectedTasks.splice(i,1);
          found = true;
          break;
        }
      }
    }

    if (found==false) {
      this.selectedTasks.push(obj);
    }

    console.log(this.selectedTasks);
    // need - entity id, entity name, task name
    this.sidebarClosed = false;
  }

  closeSidebar() {
    // reset entity
    for (let key in this.originalEntity) {
      this.selectedEntity[key] = this.originalEntity[key];
    } 

    this.sidebarClosed = true;
  }
}
