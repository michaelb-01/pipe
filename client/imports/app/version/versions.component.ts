import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { MeteorObservable } from 'meteor-rxjs';

import { Version } from "../../../../both/models/version.model";

import { VersionService } from './version.service';

import template from './versions.component.html';

@Component({
  selector: 'versions',
  providers: [VersionService],
  template
})

export class VersionsComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;

  versionsSub: Subscription;
  entityId: string;
  versions: Version[];

  constructor( private route: ActivatedRoute,
               private _versionService: VersionService ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['entityId'])
      .subscribe(entityId => {
        if (this.versionsSub) {
          this.versionsSub.unsubscribe();
        }

        this.versionsSub = MeteorObservable.subscribe('versions', this.entityId).zone().subscribe(() => {
          this.versions = this._versionService.getVersions(entityId);
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.versionsSub.unsubscribe();
  }

  toggleNotes(version) {
    version.showNotes = !version.showNotes;
    console.log('toggle notes');
  }

  selected: string[] = [];
  select(version) {
    //version.selected = !version.selected;  // toggle selected attribute

    if (version.selected != true) {
      version.selected = true;
      this.selected.push(version._id);
    }
    else {
      version.selected = false;
      var idx = this.selected.indexOf(version._id);
      this.selected.splice(idx, 1);
    }
  }

  play(el) {
    el.play(); 
  }

  pause(el) {
    el.pause();
  }  
}




