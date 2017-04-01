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
      background-color:black;
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

  xTile = 0;
  xPerc = 0;

  tileWidth = 320;
  tileHeight = 180;

  imgWidth = 9600;

  numTiles = 30;

  heightRatio = 56;

  hovering = false;

  offset = 0;

  constructor(){}

  ngAfterViewInit() {
    // once image is loaded, we need to find the image width
    let image = new Image();
    image.addEventListener('load', (e) => this.handleImageLoad(e));
    image.src = this.thumbUrl;
  }

  handleImageLoad(event): void {
    this.imgWidth = event.target.width;
    let numTiles = this.imgWidth / this.tileWidth
    this.numTiles = numTiles -1;

    // initialise the thumbnail randomly between 30% and 70% of the timeline
    let rand = 0.3 + Math.floor(Math.random() * 0.7);

    this.heightRatio = event.target.height / (this.imgWidth / numTiles) * 100;

    console.log('image width: ' + this.imgWidth);
    console.log('num tiles: ' + numTiles);
    console.log('tileWidth: ' + this.imgWidth / numTiles);
    console.log('image height: ' + event.target.height);

    this.xTile = Math.floor(this.numTiles * rand) * this.tileWidth * -1;
  }

  mouseenter(e) {
    this.hovering = true;

    // calculate difference between target 320px and actual width of element
    this.offset = (this.tileWidth - e.target.offsetWidth) / 2;
  }

  mousemove(e) {
    let xPerc = e.offsetX / e.target.offsetWidth;
    let offsetNum = Math.floor((xPerc * this.numTiles) + 0.5) * this.tileWidth * -1;

    this.xTile = offsetNum - this.offset;
    //this.xPerc = xPerc * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
