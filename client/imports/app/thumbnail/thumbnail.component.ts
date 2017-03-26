import { Component } from '@angular/core';

import template from './thumbnail.component.html';

@Component({
  providers: [],
  styles: [
  `
    .thumbnailContainer {
      width:320px;
      height:180px;
      overflow:hidden;
      position:relative;
      background-color:black;
    }
    .thumbnailWrapper {
      position:absolute;
      pointer-events:none;
      height:100%;
    }
    img {
      pointer-events:none;
      width:auto;
      max-width:100000px;
    }
    .bar {
      position: absolute;
      width: 1px;
      height: 100%;
      background-color: red;
      top: 0px;
      pointer-events:none;
    }
  `
  ],
  template
})

export class ThumbnailComponent {

  xTile = 0;
  xPerc = 0;

  tileWidth = 160;
  tileHeight = 90;

  numTiles = 24;

  constructor(){}

  mousemove(e) {
    this.xTile = Math.floor((e.offsetX / this.tileWidth * (this.numTiles-1)) + 0.5) * this.tileWidth * -1;
    this.xPerc = (e.offsetX / this.tileWidth) * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

}