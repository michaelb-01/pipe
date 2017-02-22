import {Component, AfterViewInit, ViewChild, ElementRef, Renderer} from '@angular/core'; 

import { Observable } from 'rxjs/Observable';

import { Subscription } from 'rxjs/Subscription';

import { Meteor } from 'meteor/meteor';

import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent implements AfterViewInit {
  @ViewChild('chapters') chapters: ElementRef;
  @ViewChild('vid') vid: ElementRef;

  file:string = '/Users/michaelbattcock/Desktop';

  timer:any;

  sub: Subscription;

  private trackLoadFunc: Function;

  constructor(private el: ElementRef, 
              private renderer: Renderer) {
    renderer.listen(el.nativeElement, 'onload', event => console.log(event));
  }

  ngOnInit() {
    let timer = Observable.timer(100,100).timestamp();
    this.sub = timer.take(20).subscribe(x=>{this.timerFunc()});  // try 20 times (2 seconds)

    if (Meteor.isDesktop) {
      console.log('this is desktop');
    }
    else {
      console.log('this is not desktop');
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    console.log(this.vid);
    // console.log(this.vid);
    // console.log(this.chapters);
    // setTimeout(()=>{
    //   this.displayChapters();
    // },100);
    //var path = Desktop.getFileUrl(this.file);
  }

  timerFunc() {
    console.log('check tracks');
    if (this.chapters.nativeElement.readyState == 2) {
      console.log('tracks loaded');
      this.sub.unsubscribe();
    }
  }

  displayChapters() {
    console.log(this.chapters);
  }

  videoLoaded() {
    console.log('video loaded');
  }

  //Desktop.getFileUrl(absolutePath)
  
}
