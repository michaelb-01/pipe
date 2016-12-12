import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { MeteorObservable } from 'meteor-rxjs';

import {MeteorComponent} from 'angular2-meteor';

import { Entity } from "../../../../both/models/entity.model";

import { EntityService } from './entity.service';

import template from './entity.component.html';

@Component({
  selector: 'entity',
  providers: [ EntityService ],
  template
})

export class EntityComponent extends MeteorComponent implements OnInit, OnDestroy  {
  paramsSub: Subscription;

  entitySub: Subscription;
  entityId: string;
  entity: Entity;

  constructor(private route: ActivatedRoute,
              private _entityService: EntityService ) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['entityId'])
      .subscribe(entityId => {
        if (this.entitySub) {
          this.entitySub.unsubscribe();
        }

        this.entitySub = MeteorObservable.subscribe('entities', this.entityId).zone().subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.entity = this._entityService.getEntityById(entityId);
          });
        });
      });

      if (!this.entityId) {
        console.log('entity id not found');
      } 
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.entitySub.unsubscribe();
  }

  readImageTest() {
    console.log('read image');

    var url = '/Users/michaelbattcock/Desktop/cornwall_flower_field.jpg';
    this.call("readImage",url,(e,result) => {
      console.log(result); 
    })
  }
}







