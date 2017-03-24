import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { JobsComponent } from './job/jobs.component';
import { JobComponent } from './job/job.component';

import { EntitiesComponent } from './entity/entities.component';
import { EntityComponent } from './entity/entity.component';

import { ReviewComponent } from './review/review.component';

import { AnnotationComponent } from './review/annotation.component';

//import { PartyDetailsComponent } from './parties/party-details.component';

export const routes: Route[] = [
  { path: 'jobs', component: JobsComponent, canActivate: ['canActivateForLoggedIn'] },

  { path: 'job/:jobId', component: JobComponent, canActivate: ['canActivateForLoggedIn'] },

  { path: 'entity/:entityId', component: EntityComponent, canActivate: ['canActivateForLoggedIn']},
  { path: 'entity/:entityId/:taskType', component: EntityComponent, canActivate: ['canActivateForLoggedIn']},

  { path: 'review/:versionId', component: ReviewComponent, canActivate: ['canActivateForLoggedIn'] },

  { path: '', component: AnnotationComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: '**', component: AnnotationComponent, canActivate: ['canActivateForLoggedIn'] }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
