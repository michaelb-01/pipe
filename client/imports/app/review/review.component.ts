import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Version } from "../../../../both/models/version.model";

import { VersionService } from '../version/version.service';

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import template from './review.component.html';

import styles from './review.component.scss';

declare var numeric: any;

@Component({
  providers: [
    VersionService
  ],
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})

export class ReviewComponent {
  // component variables
  paramsSub: Subscription;

  versionSub: Subscription;
  versionId: string;
  version: Version;

  nextVersion:Version;
  prevVersion:Version;

  constructor(private route: ActivatedRoute,
              private _versionService: VersionService,
              private router: Router ) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.paramsSub = this.route.params
      .map(params => params['versionId'])
      .subscribe(versionId => {
        this.versionId = versionId;

        if (this.versionSub) {
          this.versionSub.unsubscribe();
        }

        this.versionSub = MeteorObservable.subscribe('versions', this.versionId).zone().subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.version = this._versionService.getVersionById(versionId);

            this.nextVersion = this._versionService.getNextVersion(this.version.entity.entityId, this.version.version, this.version.taskType.type);
            this.prevVersion = this._versionService.getPrevVersion(this.version.entity.entityId, this.version.version, this.version.taskType.type);
          });
        });
      });
  }

  addAnnotation(annotation) {
    console.log('add annotation');
    console.log(annotation);
    
  }

  updateNote(obj) {
    let annotation = obj[0];

    if (obj[1] == 0) {
      console.log('review.component: delete annotation');
      this._versionService.deleteNoteByDate(this.versionId, annotation.date);
    }
    else if (obj[1] == 1) {
      console.log('review.component: add annotation');
      this._versionService.addNote(this.versionId, annotation);
    }
    else if (obj[1] == 2) {
      console.log('review.component: update annotation');
      this._versionService.updateNote(this.versionId, annotation);
    }
    
    console.log(annotation);
  }
}

