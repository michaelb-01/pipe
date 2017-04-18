import { Component, Input, ViewChild } from '@angular/core';

import { Version } from "../../../../both/models/version.model";

import { ReviewService } from './review.service';

import template from './comment-list.component.html';

import styles from './comment-list.component.scss';

@Component({
  selector: 'comment-list',
  styles: [    
    `:host {
      width:200px;
    }`,styles],
  template
})

export class CommentListComponent {
  @Input() version: Version;

  constructor(private _reviewService: ReviewService){}

  ngOnInit() {
  }

}
