import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Entity } from "../../../../both/models/entity.model";
import { EntityService } from '../entity/entity.service';

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import template from './entity-item.component.html';

@Component({
  selector: 'entity-item',
  template
})

export class EntityItemComponent implements OnInit {
  @Input() entity: Entity;
  @Input() showDetails: boolean;

  @Output() taskSelected: EventEmitter<any> = new EventEmitter();

  taskName: string;

  constructor(private _entityService: EntityService,
              public snackBar: MdSnackBar) {}

  ngOnInit() {}

  addTask(taskName) {
    // check if task already exists. Display popup and return if it does
    for (let i = 0; i < this.entity.tasks.length; i++) {
      if (this.entity.tasks[i].type == taskName) {
        this.openSnackBar('Task Already Exists');
        return false;
      }
    }
    
    this._entityService.addTask(this.entity._id,taskName);
  }

  selectTask(task) {
    task.selected = !task.selected;

    this.taskSelected.emit({
      'entity':this.entity,
      'task':task
    });
  }

  openSnackBar(message: string) {
    let config = new MdSnackBarConfig();
    config.duration = 2000;

    this.snackBar.open(message, false, config);
  }
}