import { Component, Renderer, ViewChild, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Version } from "../../../../both/models/version.model";

import { VersionService } from '../version/version.service';

import { MeteorObservable } from 'meteor-rxjs';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import '../shared/js/numeric-1.2.6.min.js';

import template from './review.component.html';

@Component({
  providers: [
    VersionService
  ],
  template
})

export class ReviewComponent {
  // component variables
  paramsSub: Subscription;

  versionSub: Subscription;
  versionId: string;
  version: Version;

  nextVersion:Version;
  prevVersion:Version;

  comment:string = '';
  note:string = '';

  // media (video/image) variables
  @ViewChildren('media') mediaQuery:QueryList<ElementRef>;

  mouseMoveFunc: Function;  // event listener for mouse move
  videoOnSeeking: Function;   // event listener for video seeking

  @ViewChild('canvasEl') canvas; 

  media: any;
  fps = 25.0;
  time: number;
  frame: number = 1;
  frames: number;

  // canvas variables

  ctx: CanvasRenderingContext2D;

  paint: boolean = false;

  canvasWidth: any = 20;
  canvasHeight: any = 10;

  tool: number = 1;

  strokeColour: any = "#fb3e49";
  strokeWidth: number = 2;
  strokeOpacity: number = 1;

  mouse: {
    x:number,
    y:number
  };

  xys = [];

  td = 0;
  dds = [ 0 ];

  ox;
  oy;

  constructor(private route: ActivatedRoute,
              private _versionService: VersionService,
              private renderer: Renderer,
              private router: Router ) {

    Observable.fromEvent(window, 'resize')
              .debounceTime(20)
              .subscribe((event:Event) => {
                this.resizeCanvas(event);
              });
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.paramsSub = this.route.params
      .map(params => params['versionId'])
      .subscribe(versionId => {
        this.versionId = versionId;

        if (this.versionSub) {
          this.versionSub.unsubscribe();
        }

        this.versionSub = MeteorObservable.subscribe('versions', this.versionId).zone().subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.version = this._versionService.getVersionById(versionId);

            this.nextVersion = this._versionService.getNextVersion(this.version.entity.entityId, this.version.version, this.version.taskType.type);
            this.prevVersion = this._versionService.getPrevVersion(this.version.entity.entityId, this.version.version, this.version.taskType.type);
          });
        });
      });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.mediaQuery.changes.subscribe(changes => {
      if(this.mediaQuery.toArray().length) {
        setTimeout(() => {
          console.log('Initialise video and canvas');
          this.media = changes._results[0].nativeElement;

          var width = this.media.clientWidth;
          var height = this.media.clientHeight;

          if (this.version.contentType == "video") {
            height -= 32; // allow for timebar
          }

          this.canvas.nativeElement.width = width;
          this.canvas.nativeElement.height = height;  

          // initialise canvas context
          this.ctx = this.canvas.nativeElement.getContext("2d");

          // initialise canvas variables
          this.ctx.lineWidth = this.strokeWidth;
          this.ctx.lineJoin = 'round';
          this.ctx.lineCap = 'round';

          if (this.version.contentType == "video") {
            this.frames = this.media.duration * this.fps;

            /*
            this.videoOnSeeking = this.renderer.listen(this.media, 'seeking', (event) => {
              this.videoSeeking();
            });
            */

            this.updateFrame(); // update video frame

            // autoplay video
            this.playPause();

            // video play event listener
            this.media.onplay = () => {
                this.clearCanvas();
            };
          }  

          this.drawOldStrokes();

        },500);
      }
    });
  }

  updateFrame() {
    this.time = this.media.currentTime;
    this.frame = Math.round(this.time * this.fps);  // frame rate of 25 fps

    requestAnimationFrame(()=> {
      this.updateFrame();
    });
  }

  clearCanvas() {
    console.log('clear canvas');
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  drawOldStrokes() {
    this.clearCanvas();

    console.log('draw old strokes');

    for (var i = 0; i < this.version.review.length; i++) {
      if (this.version.review[i].frame == this.frame && this.version.review[i].type == 1) {
        var ts = [];

        var length = this.version.review[i].paint.pts.length-1;

        for (var j = 0; j <= length; j++) {
          ts.push((1.0/length)*j);
        }

        var ss = numeric.spline(ts,this.version.review[i].paint.pts);
        var colour = this.version.review[i].paint.col;
        var width = this.version.review[i].paint.width;

        var scale = this.media.clientWidth / this.version.review[i].width;

        console.log('scale: ' + scale);

        this.draw_spline(ss, colour, width, scale);
      }
    }
  }

  videoSeeking() {
    console.log('video seeking');
    this.updateFrame();

    this.drawOldStrokes();
  }

  goToReview(review) {
    console.log('go to review');
    if (this.version.contentType == "video") {
      this.media.pause();
      this.media.currentTime = review.frame / this.fps;
    }
    this.flashFrame(review.frame);
    this.drawOldStrokes();
  }

  goToNextNote() {
    console.log('go to next note');
    this.media.pause();

    var lowest = 99999;
    var seekFrame = -1;

    var idx = -1;

    for (var i = 0; i < this.version.review.length; i++) {
      var diff = this.version.review[i].frame - this.frame;
      if (diff <= lowest && diff > 0) {
        lowest = diff;
        seekFrame = this.version.review[i].frame;
        idx = i;
      } 
      this.version.review[i].flash = false;
    }

    if (seekFrame > -1) {
      this.media.currentTime = seekFrame / 25.0;
      this.drawOldStrokes();
      //this.clearCanvas();
      //this.displayReview = 1;
      //this.pauseVideo();
      this.flashFrame(seekFrame);
    }
  }

  goToPreviousNote() {
    console.log('go to previous note');
    this.media.pause();

    var highest = -99999;
    var seekFrame = -1;

    var idx = -1;

    for (var i = 0; i < this.version.review.length; i++) {
      var diff = this.version.review[i].frame - this.frame;
      if (diff > highest && diff < 0) {
        highest = diff;
        seekFrame = this.version.review[i].frame;
        idx = i;
      } 
      this.version.review[i].flash = false;
    }

    if (seekFrame > -1) {
      this.media.currentTime = seekFrame / 25.0;
      this.drawOldStrokes();
      //this.clearCanvas();
      //this.displayReview = 1;
      //this.pauseVideo();
      this.flashFrame(seekFrame);
    }
  }

  goToVersion(version) {
    this.router.navigate(['/review', version._id._str]);
  }

  flashFrame(seekFrame) {
    for (var i = 0; i < this.version.review.length; i++) {
      if (this.version.review[i].frame == seekFrame) {
        this.version.review[i].flash = true;
      }
    }
  }

  canvasMouseDown(e) {
    console.log('canvas mouse down');
    if (this.version.contentType == "video") {
      this.media.pause();
    }

    this.paint = true;

    this.ctx.strokeStyle = this.hexToRgba(this.strokeColour);
    this.ctx.lineWidth = this.strokeWidth;

    var mouse = this.getMousePos(this.canvas, e);

    this.td = 0;
    this.ox = mouse[0];
    this.oy = mouse[1];
    this.xys = [ [this.ox, this.oy ]];
    this.dds = [ 0 ];

    // add event listener for mousemove
    this.mouseMoveFunc = this.renderer.listen(this.canvas.nativeElement, 'mousemove', (event) => {
      this.onPaint(event);
    });
  }

  playPause() {
    console.log('playPause');
    if (this.version.contentType == "video") {
      if (this.media.paused) {
        this.media.play(); 
        console.log('clear canvas');
        this.clearCanvas();
      }
      else {
        this.media.pause();
      }
    }
  }

  onPaint(e) {
    console.log('onPaint()');
    var mouse = this.getMousePos(this.canvas, e);

    var nx = mouse[0];
    var ny = mouse[1];

    var dx = nx - this.ox;
    var dy = ny - this.oy;
    var dd = Math.sqrt(dx*dx + dy*dy);

    if (dd > 3) {
      this.drawSegment(this.ox,this.oy, nx,ny);
      this.xys.push([nx, ny]);
      this.td += dd;
      this.dds.push(this.td);
      this.ox = nx;
      this.oy = ny;
    }
  }

  drawSegment(x1, y1, x2, y2) {
    console.log('drawSegment()');
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  simplify_spline(spold, tolerance) {
    console.log('simplifySpline()');
    // Simplifies the source spline by trying to find a smaller set of points
    // which fit within @tolerance.
    
    var tolerance2 = tolerance ? tolerance * tolerance : 10;
    var subdivide = [ 1./4, 3./8, 1./2, 5./8, 3./4 ];
    var ts = [ 0, 1 ];
    var spnew = numeric.spline(ts, spold.at(ts));
    
    for (var j=0; j<6; j++) {
        for (var i=ts.length-1; i>0; i--) {
            var mt;
            var mdd = 0;
            for (var k in subdivide) {    
                var t = ts[i] * subdivide[k] + ts[i-1] * (1 - subdivide[k]);
                
                var po = spold.at(t);
                var pn = spnew.at(t);
                var dd = this.dist2(po, pn);
            
                if (dd > mdd) {
                    mt = t;
                    mdd = dd;
                }
            }
            if (mdd > tolerance2) {
                ts.splice(i, 0, mt);
            }
        }
        spnew = numeric.spline(ts, spold.at(ts));
    }

    this.xys = [];
    
    for (var i=0; i<ts.length; i++) {
        var xy = spnew.at(ts[i]);
        this.xys.push([xy[0],xy[1]]);
    }

    return spnew;
  }

  draw_spline(spline, colour, width, scale) {
    console.log('drawSpline()');
    var xys = spline.at(numeric.linspace(0,1,100));
    this.ctx.beginPath();
    this.ctx.moveTo(xys[0][0]*scale,xys[0][1]*scale);
    for (var i = 1; i < xys.length; i++) {
        this.ctx.lineTo(xys[i][0]*scale, xys[i][1]*scale);
    }

    this.ctx.strokeStyle = colour;
    this.ctx.lineWidth = width;

    this.ctx.stroke();
    this.ctx.closePath();
  }

  endPaint() {
    console.log('endPaint()');
    if (this.mouseMoveFunc != null) {
      this.mouseMoveFunc();
    }

    this.paint = false;

    // need at least two points
    if (this.dds.length > 1) {
      var ts = [];
      for (var i in this.dds) {
        ts.push(this.dds[i]/this.td);
      }

      var ss = numeric.spline(ts,this.xys);
      //this.draw_spline(ss, "#0F0");

      // do this to generate simplified points in this.xys
      var ss2 = this.simplify_spline(ss,10);

      this.submitReview(1);

      this.drawOldStrokes();

      var colour = this.hexToRgba(this.strokeColour);

      this.draw_spline(ss2, colour, this.strokeWidth, 1);
    }

    //document.getElementById("commentInput").focus();
  }

  // UTILITY FUNCTIONS
  submitReview(type) {
    console.log('submitReview()');


    var paint = {};
    var comment = '';

    if (type == 0) {    // comment
      if (this.comment == '') {
        return;
      }
      comment = this.comment;
    }
    else {              // annotation
      paint = {
        'width': this.strokeWidth,
        'col': this.hexToRgba(this.strokeColour),
        'pts': this.xys
      }
    }

    console.log('submit review');

    var review = {
      'type': type,
      'user': 'Mike Battcock',
      'frame': this.frame,
      'comment': comment,
      'paint': paint,
      'width': this.media.clientWidth,
      'date': new Date(),
      'replies': [],
      'status': 'unread'
    }

    this._versionService.addReview(this.versionId, review);
    this.comment = '';
  }

  submitNote() {
    var note = {
      'author': {
        'id':'',
        'name':'Mike Battcock'
      },
      'body':this.note,
      'date':new Date()
    }

    this._versionService.addNote(this.versionId, note);
  }

  deleteReview(e,review) {
    console.log('deleteReview()');
    e.stopPropagation();

    this._versionService.deleteReview(this.versionId, review.date);

    for (var i = 0; i < this.version.review.length; i++) {
      if (this.version.review[i].date == review.date) {
        this.version.review.splice(i, 1);
        break;
      }
    }

    this.drawOldStrokes();
  }

  deleteNote(e,note) {
    console.log('deleteNote()');

    this._versionService.deleteNote(this.versionId, note.date);
  }

  getMousePos(canvas, e) {
    console.log('getMousePos()');
    var rect = this.canvas.nativeElement.getBoundingClientRect();

    // use touches for iphone

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return [x,y];
  }

  resizeCanvas(e: Event) {
    console.log('resizeCanvas()');
    var width = this.media.clientWidth;
    var height = this.media.clientHeight;

    if (this.version.contentType == "video") {
      height -= 32; // allow for timebar
    }

    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;

    console.log(this.media);
    this.drawOldStrokes();
  }

  mouseOffCanvas() {
    console.log('mouseOffCanvas()');
    if (this.paint) {
      this.endPaint();
    }
  }

  // distance between two points
  dist2(p1, p2) {
    console.log('dist2()');
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return dx * dx + dy * dy;
  }

  hexToRgba(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      var r = parseInt(result[1], 16);
      var g = parseInt(result[2], 16);
      var b = parseInt(result[3], 16);

      var rgba = "rgba(" + r + "," + g + "," + b + "," + this.strokeOpacity + ")";

      return result ? rgba : null;
  }

  checkTool() {
    console.log(this.tool);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy()');
    // end mousemove listener
    if (this.mouseMoveFunc != null) {
      this.mouseMoveFunc();
    }

    if (this.videoOnSeeking != null) {
      this.videoOnSeeking();
    }
  }
}