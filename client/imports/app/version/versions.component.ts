import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

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
  versions: Observable<Version[]>;
  taskType: string;

  on = '#ff0d0d';
  off = '#fff';

  status2d = this.on;
  status3d = this.on;
  toggle2d = this.on;
  toggle3d = this.on;

  disciplines: ['3D,2D'];

  types3d:any[] = [
    {'value':'track','active':true},
    {'value':'model','active':true},
    {'value':'texture','active':true},
    {'value':'lookdev','active':true},
    {'value':'light','active':true},
    {'value':'rig','active':true},
    {'value':'anim','active':true},
    {'value':'fx','active':true}
  ];

  types2d:any[] = [
    {'value':'concept','active':true},
    {'value':'mattePaint','active':true},
    {'value':'roto','active':true},
    {'value':'comp','active':true},
    {'value':'grade','active':true}
  ];

  types = [];

  sidebarClosed = true;

  constructor( private route: ActivatedRoute,
               private _versionService: VersionService ) {

    this.types2d.forEach(type=>{
      this.types.push(type.value);
    })
    this.types3d.forEach(type=>{
      this.types.push(type.value);
    })
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .subscribe(params => {
        if (this.versionsSub) {
          this.versionsSub.unsubscribe();
        }

        this.entityId = params['entityId'];
        this.taskType = params['taskType'];

        if (this.taskType) {
          this.selectType(this.taskType);
        }

        this.versionsSub = MeteorObservable.subscribe('versions', this.entityId).zone().subscribe(() => {
          this.versions = this._versionService.getVersions(this.entityId);

          console.log(this.versions);
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.versionsSub.unsubscribe();
  }

  selectType(type:string) {
    var count = 0;
    for(var i = 0; i < this.types2d.length; i++) {
      if (type != this.types2d[i].value) {
        this.types2d[i].active = false;
      }
      else {
        this.types2d[i].active = true;
        count += 1;
      }
    }

    // task type is from 2d
    if (count > 0) {
      this.status2d = this.off;
      this.toggle2d = this.on;
      this.status3d = this.off;
      this.toggle3d = '#ccc';
    }
    else {
      this.status3d = this.off;
      this.toggle3d = this.on;
      this.status2d = this.off;
      this.toggle2d = '#ccc';
    }

    for(var i = 0; i < this.types3d.length; i++) {
      if (type != this.types3d[i].value) {
        this.types3d[i].active = false;
      }
      else {
        this.types3d[i].active = true;
      }
    }

    // update types array
    this.types = [type];
  }

  toggleNotes(version) {
    if (version.showNotes) {
      version.showNotes = false;
      this.sidebarClosed = true;
    }
    else {
      version.showNotes = true;
      this.sidebarClosed = false;
    }
  }

  toggleSidebarRight() {
    this.sidebarClosed = true;
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

  toggle2dFunc() {
    if (this.toggle2d == this.on) {
      var index;
      this.types2d.forEach(type=>{
        type.active = false;
        index = this.types.indexOf(type.value);
        this.types.splice(index,1);  
      });

      this.status2d = this.off; 
      this.toggle2d = '#ccc';
    }
    else {
      this.types2d.forEach(type=>{
        type.active = true;
        this.types.push(type.value);
      });

      this.status2d = this.on; 
      this.toggle2d = this.on;
    }

    // create new array to force angular to update
    this.types = [...this.types];
  }

  toggle3dFunc() {
    if (this.toggle3d == this.on) {
      var index;
      this.types3d.forEach(type=>{
        type.active = false;
        index = this.types.indexOf(type.value);
        this.types.splice(index,1);  
      });

      this.status3d = this.off; 
      this.toggle3d = '#ccc';
    }
    else {
      this.types3d.forEach(type=>{
        type.active = true;
        this.types.push(type.value);
      });

      this.status3d = this.on; 
      this.toggle3d = this.on;
    }

    // create new array to force angular to update
    this.types = [...this.types];
  }

  toggleActive2d(el) {
    if (el.active == true) {
      el.active = false;
      var index = this.types.indexOf(el.value);
      this.types.splice(index,1);
    }
    else {
      el.active = true;
      this.types.push(el.value);
    }

    // create new array to force angular to update
    this.types = [...this.types];

    var count = 0;

    for (var i = 0; i < this.types2d.length; i++) {
      if (this.types2d[i].active == true) {
        count += 1;
      }
    }

    if (count == 0) {
      this.status2d = this.off; 
      this.toggle2d = '#ccc';
    }
    else if (count == this.types2d.length) {
      this.status2d = this.on;
      this.toggle2d = this.on;
    }
    else {
      this.status2d = this.off;
      this.toggle2d = this.on;
    }
  }

  toggleActive3d(el) {
    if (el.active == true) {
      el.active = false;
      var index = this.types.indexOf(el.value);
      this.types.splice(index,1);
    }
    else {
      el.active = true;
      this.types.push(el.value);
    }

    // create new array to force angular to update
    this.types = [...this.types];

    var count = 0;

    for (var i = 0; i < this.types3d.length; i++) {
      if (this.types3d[i].active == true) {
        count += 1;
      }
    }

    if (count == 0) {
      this.status3d = this.off; 
      this.toggle3d = '#ccc';
    }
    else if (count == this.types3d.length) {
      this.status3d = this.on;
      this.toggle3d = this.on;
    }
    else {
      this.status3d = this.off;
      this.toggle3d = this.on;
    }
  }
}




