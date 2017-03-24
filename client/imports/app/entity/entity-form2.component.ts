import { Component, Input } from '@angular/core';

import { Entity } from '../../../../both/models/entity.model';

import { EntityService } from './entity.service';

import template from './entity-form2.component.html';

@Component({
  selector: 'entity-form2',
  providers: [EntityService],
  template
})

export class EntityForm2Component {
  @Input() method;

  constructor(private _entityService: EntityService) {
  }

  entity: Entity = {
    'job': {
      'jobId': '',
      'jobName': ''
    },
    'name': '',
    'type': '',
    'tasks': [],
    'status': '',
    'description': '',
    'public': true
  };

  ngOnInit() {
  }

  update(selectedTasks, selectedEntity) {
    this.entity = selectedEntity;
  }

  onSubmit() {
    let oldPath = '';

    const parts = this.entity.path.split('/');

    // if the name has been updated we need to update the folder name on the local file system
    if (this.entity.name != parts.pop()) {
      oldPath = this.entity.path;
      this.entity['path'] = parts.join('/') + '/' + this.entity.name;
    }

    this._entityService.updateEntity(this.entity, oldPath);
  }

  deleteEntity() {

  }
} 