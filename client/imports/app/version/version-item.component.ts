import { Component, Input, ViewEncapsulation } from '@angular/core';

import styles from './version-item.component.scss';

import template from './version-item.component.html';

@Component({
  selector: 'version-item',
  styles: [styles],
  encapsulation: ViewEncapsulation.Native,
  template
})

export class VersionItemComponent {
	constructor() {

	}
}