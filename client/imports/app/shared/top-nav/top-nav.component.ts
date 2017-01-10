import { Component } from '@angular/core';
import { Router } from '@angular/router';

import template from './top-nav.component.html';

@Component({
  selector: 'pipe-top-nav',
  template
})

export class TopNavComponent {
  constructor(private router: Router ) {}

  ngOnInit() {
    Tracker.autorun(() => {
      if (Meteor.userId()) {
        console.log('logged in');
        //this.router.navigate(['/jobs']);
      } else {
        console.log('logged out');
        //this.router.navigate(['/jobs']);
      }
    });
  }

}