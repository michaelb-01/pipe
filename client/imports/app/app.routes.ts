import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { JobsComponent } from './job/jobs.component';
import { JobComponent } from './job/job.component';

import { EntitiesComponent } from './entity/entities.component';
import { EntityComponent } from './entity/entity.component';

import { ReviewComponent } from './review/review.component';

//import { PartyDetailsComponent } from './parties/party-details.component';

export const routes: Route[] = [
  { path: '', component: JobsComponent },
  { path: 'job/:jobId', component: JobComponent },

  { path: 'entity/:entityId', component: EntityComponent},

  { path: 'review/:versionId', component: ReviewComponent }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
