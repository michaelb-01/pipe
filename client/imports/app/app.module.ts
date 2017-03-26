import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';

import { SHARED_DECLARATIONS } from './shared';
import { JOBS_DECLARATIONS } from './job';
import { ENTITIES_DECLARATIONS } from './entity';
import { VERSIONS_DECLARATIONS } from './version';
import { REVIEW_DECLARATIONS } from './review';
import { TODO_DECLARATIONS } from './todo';
import { THUMBNAIL_DECLARATIONS } from './thumbnail';

import { APP_BASE_HREF } from '@angular/common';

import { MaterialModule } from '@angular/material';

import 'hammerjs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AccountsModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    ...SHARED_DECLARATIONS,
    ...JOBS_DECLARATIONS,
    ...ENTITIES_DECLARATIONS,
    ...VERSIONS_DECLARATIONS,
    ...REVIEW_DECLARATIONS,
    ...TODO_DECLARATIONS,
    ...THUMBNAIL_DECLARATIONS
  ],
  providers: [
    ...ROUTES_PROVIDERS,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}