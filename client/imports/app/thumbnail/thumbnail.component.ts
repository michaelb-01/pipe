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
      width:100%;
      height:100%;
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
  @Input() pos;

  xTile = 0;
  xPerc = 0;

  tileWidth = 320;
  tileHeight = 180;

  imgWidth = 9600;

  numTiles = 24;

  hovering = false;

  constructor(){}

  ngAfterViewInit() {
    console.log(this.thumbUrl.split('_').pop());
    let end = this.thumbUrl.split('_').pop();

    let image = new Image();
    image.addEventListener('load', (e) => this.handleImageLoad(e));
    image.src = this.thumbUrl;

    this.numTiles = parseInt(end.split('.')[0]) / 320;
  }

  handleImageLoad(event): void {
    this.imgWidth = event.target.width;
    console.log('original image width: ' + this.imgWidth);
  }

  mouseenter(e) {
    //this.tileWidth = e.target.offsetWidth;
    this.hovering = true;

    console.log('width: ' + this.tileWidth);
    console.log('thi')
  }

  mousemove(e) {
    this.xTile = Math.floor((e.offsetX / this.tileWidth * (this.numTiles-1)) + 0.5) * this.tileWidth * -1;
    this.xPerc = (e.offsetX / this.tileWidth) * 100;

    e.stopPropagation();
    e.preventDefault();
    return false;
  }



}
