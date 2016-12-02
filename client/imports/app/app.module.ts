import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { PARTIES_DECLARATIONS } from './parties';

import { SHARED_DECLARATIONS } from './shared';
import { JOBS_DECLARATIONS } from './job';
import { ENTITIES_DECLARATIONS } from './entity';
import { VERSIONS_DECLARATIONS } from './version';
import { REVIEW_DECLARATIONS } from './review';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MaterialModule.forRoot(),
    AccountsModule
  ],
  declarations: [
    AppComponent,
    ...SHARED_DECLARATIONS,
    ...JOBS_DECLARATIONS,
    ...ENTITIES_DECLARATIONS,
    ...VERSIONS_DECLARATIONS,
    ...REVIEW_DECLARATIONS
  ],
  providers: [
    ...ROUTES_PROVIDERS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}