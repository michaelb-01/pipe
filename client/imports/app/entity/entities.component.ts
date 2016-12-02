import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entity } from "../../../../both/models/entity.model";
import { Entities } from "../../../../both/collections/entities.collection";

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { EntityService } from './entity.service';

import template from './entities.component.html';

@Component({
  selector: 'entities',
  providers: [ EntityService ],
  template
})

export class EntitiesComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;

  entitiesSub: Subscription;
  entities: Observable<Entity[]>;

  jobId: string;

  first: Object;

  assets = [];
  shots = [];

  assets2: Observable<Entity[]>;
  shots2: Observable<Entity[]>;

  selected = [];

  constructor(private route: ActivatedRoute,
              private _entityService: EntityService) { 
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['jobId'])
      .subscribe(jobId => {
        this.jobId = jobId;
        
        if (this.entitiesSub) {
          this.entitiesSub.unsubscribe();
        }

        this.entitiesSub = MeteorObservable.subscribe('entities', this.jobId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            //this.entities = this._entityService.getJobEntities(jobId);
            this.entities = Entities.find({"job.jobId":jobId });//.filter(entity => entity.name == "test");

            this.assets2 = this.entities
                                  .map(function(entity) {
                                    return entity.filter(function(e) {
                                      return e.type == "asset";
                                    })
                                  });
            //console.log(x);

            if (!this.entities) return;

            this.entities.forEach((item, index) => {
              // sort into assets and shots
              if (item.type === 'asset') {
                this.assets.push(item);
              } else if (item.type === 'shot') {
                this.shots.push(item);
              }
            });
          });
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.entitiesSub.unsubscribe();
  }

  shiftDown = false;
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    if (event.keyCode == 16) {
      this.shiftDown = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    if (event.keyCode == 16) {
      this.shiftDown = false;
    }
  }

  select(entity,task,entityId,taskId) {
    var obj = { "id":entity._id, 
                "type":task.type, 
                "name":entity.name, 
                "entityType":entity.type, 
                "entityId":entityId, 
                "taskId":taskId };

    if (this.shiftDown == false) {

      if (entity.type == 'asset') {
        this.deselectAssets();
      }
      else {
        this.deselectShots();
      }

      task.selected = true;

      this.selected = [];
      this.selected.push(obj);

      return;
    }

    task.selected = !task.selected;  // toggle selected attribute

    var contains = false;

    var i;
    for (i = 0; i < this.selected.length; i++) {
      if (this.selected[i].id + this.selected[i].type == obj.id + obj.type) {
        contains = true;
        break;
      }
    }

    if (contains == true) {
      this.selected.splice(i, 1);
    }
    else {
      this.selected.push(obj);
    }

    //this.selected.push(entity);

    console.log(this.selected);
    console.log('index: ' + i);

    //this._sharedService.updateSel({"id":entity._id, "type":task.type, "name":entity.name}, 'entity');
  }

  editSelected() {

    console.log('edit selected');
  }

  showDetails = false;
  showTaskDetails() {
    this.showDetails = !this.showDetails;
  }

  onAssign(event) {
    //this.assets[0].tasks.splice(1,1);

    if (this.selected.length < 1) {
      console.log('no tasks selected');
      return;
    }
    else if (event.users.length < 1) {
      console.log('no users selected');
      return;
    }

      // iterate over selected users
      event.users.forEach((selUser) => {

        for (var i = 0; i < this.selected.length; i++) {
          if (this.selected[i].entityType == 'asset') {
            // iterate over selected tasks
            var assetId = this.selected[i].entityId;
            var taskId = this.selected[i].taskId;

            var found = false;

            var j;
            for (j = 0; j < this.assets[assetId].tasks[taskId].users.length; j++) {
               if (this.assets[assetId].tasks[taskId].users[j].name == selUser.name) {
                found = true;
                console.log('found: ' + selUser + ' in ' + this.assets[assetId]);
                break;
              }
            }

            if (found == false) {
              if (event.mode == true) {
                this.assets[assetId].tasks[taskId].users.push({"name":selUser.name});
                this._entityService.assignUser(this.assets[assetId]._id, taskId, selUser.name);
              }
            }
            else {
              if (event.mode == false) {
                this.assets[assetId].tasks[taskId].users.splice(j,1);
                this._entityService.unassignUser(this.assets[assetId]._id, taskId, selUser.name);
              }
            }
          }
          else {
            // iterate over selected tasks
            var shotId = this.selected[i].entityId;
            var taskId = this.selected[i].taskId;

            var found = false;

            console.log(this.shots[shotId]);

            var j;
            for (j = 0; j < this.shots[shotId].tasks[taskId].users.length; j++) {
               if (this.shots[shotId].tasks[taskId].users[j].name == selUser.name) {
                found = true;
                console.log('found: ' + selUser + ' in ' + this.assets[shotId]);
                break;
              }
            }

            if (found == false) {
              if (event.mode == true) {
                this.shots[shotId].tasks[taskId].users.push({"name":selUser.name});
                this._entityService.assignUser(this.shots[shotId]._id, taskId, selUser.name);
              }
            }
            else {
              if (event.mode == false) {
                this.shots[shotId].tasks[taskId].users.splice(j,1);
                this._entityService.unassignUser(this.shots[shotId]._id, taskId, selUser.name);
              }
            }
          }
        }
      });

      //this.assets = [];
    
  }

  deselectAssets() {
    this.assets.forEach((asset) => {
        asset.tasks.forEach((task) => {
          task.selected = false;
        });
      });
  }

  deselectShots() {
    this.shots.forEach((shot) => {
      shot.tasks.forEach((task) => {
        task.selected = false;
      });
    });
  }

  showSidebarRight = false;
  toggleSidebarRight(newState) {
    this.showSidebarRight = newState;
    this.selected.length = 0;

    this.deselectAssets();
    this.deselectShots();
  }

  tooltipName = '';
  left = '0';
  top = '0';
  showTooltip(e, str) {
    this.tooltipName = str;

    // not sure of the correct way to get the absolute mouse position...
    var posx = e.clientX - e.offsetX - 20 - (str.length*4.2);
    var posy = e.clientY - e.offsetY - 240;

    console.log(e);

    this.top = posy + 'px';
    this.left = posx + 'px';
    //this.top = e.clientY - e.offsetY - 240 + 'px';
    //this.left =  + 'px';
  }
}


