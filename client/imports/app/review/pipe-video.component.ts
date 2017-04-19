import { Component, Input, ViewChild } from '@angular/core';

import { ReviewService } from './review.service';

//import {Observable} from 'rxjs/Observable';

import template from './pipe-video.component.html';

import styles from './pipe-video.component.scss';

@Component({
  selector: 'pipe-video',
  host: {
    '(document:keydown)': 'handleKeydown($event)'
  },
  styles: [styles],
  template
})

export class PipeVideoComponent {
  @Input() version: any;
  @Input() src: string;
  @Input() thumbUrl: string;

  @ViewChild('pipeVideo') pipeVideo: any;
  @ViewChild('seekBar') seekBar: any;

  fps = 25;
  frameListener:any;

  playing:boolean = false;

  numFrames:number = 25;

  volumeBarInset:number = 0;
  selectedBar:number = 0;

  // Thumbnail //
  seekPosition: number = 0;
  tileWidth = 320;
  xpos = 0;
  xratio = 0;
  numTiles = 30;
  heightRatio = 56;
  hovering = false;

  constructor(private _reviewService: ReviewService){}

  ngOnInit() {
    this.videoInit();

    this.thumbUrl = '/img/frames_sprites.jpg';
    this.src = '/video/frames.mov';
  }

  ngAfterViewInit() {
    // once image is loaded, we need to find the image width
    let image = new Image();
    image.addEventListener('load', (e) => this.imageLoad(e));
    image.src = this.thumbUrl;

    //let onLoad = Observable.fromEvent(this.pipeVideo.nativeElement, 'loadedmetadata');
    //onLoad.subscribe(this.onLoad.bind(this));

    //let video = new HTMLVideoElement();
    //video.addEventListener('loadedmetadata', (e) => this.videoLoad(e));
    //video.src = this.src;

    
    console.log(this.numFrames);
  }

  videoLoaded(event) {
    this.numFrames = event.target.duration * this.fps;
  }

  imageLoad(e): void {
    let imgWidth = e.target.width;
    let numTiles = imgWidth / this.tileWidth;

    this.numTiles = numTiles - 1;
    this.heightRatio = e.target.height / (imgWidth / numTiles) * 100;
    this.xratio = 100.0 / this.numTiles;
  }

  videoInit() {

    this.updateFrame();
  }

  updateFrame() {
    this._reviewService.time = this.pipeVideo.nativeElement.currentTime;
    this._reviewService.frame = Math.round(this._reviewService.time * this.fps) + 1;  // frame rate of 25 fps

    if (this.playing == true) {
      this.seekBar.nativeElement.value = Math.round((this.pipeVideo.nativeElement.currentTime / this.pipeVideo.nativeElement.duration) * this.numFrames);
    }

    requestAnimationFrame(()=> {
      this.updateFrame();
    });
  }

  togglePlay() {
    if (this.pipeVideo.nativeElement.paused) {
      this.pipeVideo.nativeElement.play();
      this.playing = true;
    }
    else {
      this.pipeVideo.nativeElement.pause();
      this.playing = false;
    }
  }

  seekBarMouseMove(e) {
    if (e.target.className != "seekBar") return;

    let xRatio = e.offsetX / e.target.offsetWidth;

    this.seekPosition = xRatio * 100;
   
    this.xpos = Math.round(xRatio * this.numTiles) * this.xratio; 
  }

  handleKeydown(e) {
    // if comment is being typed we need to prevent space bar triggering playback
    if (document.activeElement.placeholder == "Comment") return;

    if(e.keyCode == 32){
      this.togglePlay();
    }
  }

  updateSeekbar(e) {
    console.log('update seekbar');
    //if (this.playing == false) return;
    //this.seekBar.nativeElement.value = (100 / this.pipeVideo.nativeElement.duration) * this.pipeVideo.nativeElement.currentTime;
  }

  updateTime(e) {
    this.pipeVideo.nativeElement.currentTime = (e.target.value-1) / this.fps;

    console.log('update time');
    console.log(e.target.value);
  }

  volumeBarInsetFunc(e,i) {
    let offset = e.target.offsetWidth - e.offsetX;
    this.volumeBarInset = offset;
    this.selectedBar = i;
    console.log(i);
  }
}
