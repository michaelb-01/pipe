import { Component, Input, ViewChild } from '@angular/core';

import { Version } from "../../../../both/models/version.model";

import { ReviewService } from './review.service';

import template from './comment-item.component.html';

import styles from './comment-item.component.scss';

@Component({
  selector: 'comment-item',
  styles: [  
    `:host {
      position:relative;
      background-color: white;
      display: block;
      width: 100%;
      padding: 5px;
      box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
    }`,styles],
  template
})

export class CommentItemComponent {
  @Input() comment: any;

  constructor(private _reviewService: ReviewService){}

  ngOnInit() {
  }

}
