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
  hotEntities: Observable<Entity[]>;

  jobId: string;

  first: Object;

  assets = [];
  shots = [];

  assets2: Observable<Entity[]>;
  shots2: Observable<Entity[]>;

  selected = [];

  sidebarClosed = true;

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
            this.assets2 = Entities.find({$and:[{"job.jobId":jobId},{"type":"asset"}]});//.filter(entity => entity.name == "test");

            this.shots2 = Entities.find({$and:[{"job.jobId":jobId},{"type":"shot"}]});

            // this.assets2 = this.hotEntities
            //                     .filter(function(e) {
            //                         console.log(e);
            //                         return e.type == "asset";
            //                       })
            //                     });

            if (!this.entities) return;

            // this.entities.forEach((item:Entity[]) => {
            //   // sort into assets and shots
            //   if (item.type === 'asset') {
            //     this.assets.push(item);
            //   } else if (item.type === 'shot') {
            //     this.shots.push(item);
            //   }
            // });
          });
        });
      });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addTask(entityId, taskName) {
    console.log(entityId);
    console.log(taskName);
    this._entityService.addTask(entityId,taskName);
  }

  filterTest(obj) {
    console.log('filter entities');
    console.log(obj);
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
    this.sidebarClosed = false;

    var obj = { "id":entity._id, 
                "type":task.type, 
                "name":entity.name, 
                "entityType":entity.type, 
                "entityId":entityId, 
                "taskId":taskId,
                "task":entity.tasks[taskId] };

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
    if (event.mode == false) {
      for (var i = 0; i < this.selected.length; i++) {
        for (var j = 0; j < event.users.length; j++) {
          this._entityService.unassignUser(this.selected[i].id._str, this.selected[i].taskId, event.users[j]);
          this.reselect();
        }
      }
    }
    else {
      for (var i = 0; i < this.selected.length; i++) {
        this._entityService.assignUser(this.selected[i].id._str, this.selected[i].taskId, event.users);
        //this.selected[i].task.users.push({"name":event.users[j].name});
        this.reselect();
      }
    }
  }

  reselect() {
    this.selected.forEach(sel => {
      this.assets2._data.forEach(asset => {
         if (asset._id._str == sel.id._str) {
           asset.tasks[sel.taskId].selected = true;
         }
      });
      this.shots2._data.forEach(shot => {
         if (shot._id._str == sel.id._str) {
           shot.tasks[sel.taskId].selected = true;
         }
      })
    });
  }

  onAssignOld(event) {
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
      // iterate over selected tasks

      console.log('check user:');
      console.log(selUser);

      for (var i = 0; i < this.selected.length; i++) {
        if (this.selected[i].entityType == 'asset') {
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
    console.log('deslect assets');
    this.assets2._data.forEach(asset => {
      asset.tasks.forEach(task => {
        task.selected = false;
      });
    });
  }

  deselectShots() {
    this.shots2._data.forEach((shot) => {
      shot.tasks.forEach((task) => {
        task.selected = false;
      });
    });
  }

  toggleSidebarRight(newState) {
    this.sidebarClosed = true;
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


