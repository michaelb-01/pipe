import { Component, Input } from '@angular/core';

import template from './thumbnail.component.html';

@Component({
  selector: 'thumbnail',
  providers: [],
  styles: [
  `
    :host { 
      width:100%;
      height:100%;
    }
    .thumbnailContainer {
      display:block;
      width:100%;
      height:0;
      overflow:hidden;
      position:relative;
    }
    .thumbnailWrapper {
      position:absolute;
      pointer-events:none;
      height:100%;
    }
    .thumbnail {
      background-repeat: no-repeat;
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;
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
    .fade {
      position:absolute;
      top:0;
      left:0;
      background-color: black;
      width: 100%;
      height: 100%;
      z-index: 100;
      opacity: 0.5;
      transition: opacity 0.4s;
    }
    .fadeOut {
      opacity: 0;
    }
  `
  ],
  template
})

export class ThumbnailComponent {
  @Input() thumbUrl;
  tileWidth = 320;

  xpos = 0;
  xratio = 0;

  numTiles = 30;

  heightRatio = 56;

  hovering = false;

  constructor(){}

  ngAfterViewInit() {
    // once image is loaded, we need to find the image width
    let image = new Image();
    image.addEventListener('load', (e) => this.handleImageLoad(e));
    image.src = this.thumbUrl;
  }

  handleImageLoad(event): void {
    let imgWidth = event.target.width;
    let numTiles = imgWidth / this.tileWidth;

    this.numTiles = numTiles - 1;

    this.heightRatio = event.target.height / (imgWidth / numTiles) * 100;

    this.xratio = 100.0 / this.numTiles;
  }

  mouseenter(e) {
    this.hovering = true;
  }

  mousemove(e) {
    let xPerc = e.offsetX / e.target.offsetWidth;

    this.xpos = Math.round(xPerc * this.numTiles) * this.xratio; 
    //this.xPerc = xPerc * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
