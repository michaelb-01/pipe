import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core'; 

import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent implements AfterViewInit {
  @ViewChild('chapters') chapters: ElementRef;
  @ViewChild('vid') vid: ElementRef;

  file:string = '/Users/michaelbattcock/Desktop';

  private trackLoadFunc: Function;

  constructor() {}

  ngAfterViewInit() {
    setTimeout(()=> {
      console.log('display chapters');
      console.log(this.chapters);
      console.log(this.vid);
    },1000);


    //var path = Desktop.getFileUrl(this.file);
  }

  displayChapters(event) {
    console.log('display chapters');
  }

  //Desktop.getFileUrl(absolutePath)
  
}
