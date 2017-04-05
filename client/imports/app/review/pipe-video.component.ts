import { Component, Input, ViewChild } from '@angular/core';

import { ReviewService } from './review.service';

import template from './pipe-video.component.html';

@Component({
  selector: 'pipe-video',
  host: {
    '(document:keydown)': 'handleKeydown($event)'
  },
  template
})

export class PipeVideoComponent {
  @Input() src: string;

  @ViewChild('pipeVideo') pipeVideo: any;

  fps = 25;
  frameListener:any;

  constructor(private _reviewService: ReviewService){}

  ngOnInit() {
    console.log('source:');
    console.log(this.src);

    console.log('review service: ');
    console.log(this._reviewService.frame);

    this.videoInit();
  }

  videoInit() {
    this.updateFrame();
  }

  updateFrame() {
    this._reviewService.time = this.pipeVideo.nativeElement.currentTime;
    this._reviewService.frame = Math.round(this._reviewService.time * this.fps);  // frame rate of 25 fps

    requestAnimationFrame(()=> {
      this.updateFrame();
    });
  }

  playPause() {
    if (this.pipeVideo.nativeElement.paused) {
      this.pipeVideo.nativeElement.play();
    }
    else {
      this.pipeVideo.nativeElement.pause();
    }
  }

  handleKeydown(e) {
    if(e.keyCode == 32){
      this.playPause();
    }
  }
}
