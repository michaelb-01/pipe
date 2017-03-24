import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entity } from "../../../../both/models/entity.model";
import { Entities } from "../../../../both/collections/entities.collection";
import { EntityService } from './entity.service';

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import template from './entities2.component.html';

@Component({
  selector: 'entities2',
  providers: [ EntityService ],
  template
})

export class Entities2Component implements OnInit, OnDestroy {
  paramsSub: Subscription;

  entitiesSub: Subscription;
  entities: Observable<Entity[]>;

  assets: Entity[] = [];
  shots: Entity[] = [];

  jobId: string;

  sidebarClosed: boolean = true;

  constructor(private route: ActivatedRoute,
              private _entityService: EntityService) { }

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

            this._entityService.findEntities(jobId,'asset').subscribe(entities => {
              this.assets = entities;
            });

            this._entityService.findEntities(jobId,'shot').subscribe(entities => {
              this.shots = entities;
            });

            if (!this.entities) return;
          });
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.entitiesSub.unsubscribe();
  }
}

