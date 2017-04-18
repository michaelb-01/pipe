import { Component, Input, ViewChild } from '@angular/core';

import { ReviewService } from './review.service';

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
  @Input() src: string;
  @Input() thumbUrl: string;

  @ViewChild('pipeVideo') pipeVideo: any;
  @ViewChild('seekBar') seekBar: any;

  fps = 25;
  frameListener:any;

  playing:boolean = false;

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
    console.log('source:');
    console.log(this.src);

    console.log('review service: ');
    console.log(this._reviewService.frame);

    this.videoInit();

    this.thumbUrl = '/img/frames_sprites.jpg';
    this.src = '/video/frames.mov';
  }

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

  videoInit() {
    this.updateFrame();
  }

  updateFrame() {
    this._reviewService.time = this.pipeVideo.nativeElement.currentTime;
    this._reviewService.frame = Math.round(this._reviewService.time * this.fps) + 1;  // frame rate of 25 fps

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

    this.seekPosition = xRatio* 100;
   
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
    this.seekBar.nativeElement.value = (100 / this.pipeVideo.nativeElement.duration) * this.pipeVideo.nativeElement.currentTime;
  }

  updateTime(e) {
    this.pipeVideo.nativeElement.currentTime = e.target.value / this.fps;

    console.log('update time');
  }
}
