import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IAnnotation, Annotation } from './annotation.model';
import { Version } from "../../../../both/models/version.model";

import { ReviewService } from './review.service';

import template from './annotation.component.html';

@Component({
  selector: 'annotation',
  providers: [],
  styles: [
  `
    .annotationWrapper {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .annotationContainer {
      position: relative;
      width:100%; 
      height:100%; 
      z-index: 1;
    }
    .annotation {
      position: absolute;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
      background-clip: content-box;
      padding: 1px;
      border: 1px solid white;
      border-radius: 50%;
      background-color: white;
      cursor: pointer;
      z-index: 2;
    }
    .annotationText {
      position: relative;
      width: 100px;
      background-color:white;
      box-shadow: -1px 1px 10px 0px rgba(0,0,0,0.2);
      border-radius: 3px;
      padding:10px 5px 0 5px;
    }
    .annotationDelete {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 14px;
      padding: 4px;
      color: #ccc;
    }
    .line {
      pointer-events:none;
      width: 20px;
      height: 1px;
      margin-top: 2px;
      margin-left: 3px;
      transform-origin: 0 0;
      transform: rotate(28deg);
      background-color: white;
    }
  `
  ],
  template
})

export class AnnotationComponent {
  @Input() version: Version;

  @Output() updateComment: EventEmitter<any> = new EventEmitter();

  @ViewChild('annotationContainer') annotationContainer; 
  @ViewChildren("myAnnotation") private myAnnotations: QueryList<ElementRef>;

  annotations:IAnnotation[] = [];
  dragging:boolean = false;

  width:number = 0;
  height:number = 0;
  offsetLeft:number = 0;
  offsetTop:number = 0;

  annotationDim:any = {
    'left': 0,
    'top': 0,
    'right': 0,
    'bottom': 0
  }

  offsetX:number = 0;
  offsetY:number = 0;

  selectedAnnotation:any = new Annotation();

  selectedAnnotationEl:any;
  selectedTextBoxEl:any;

  pos1X;
  pos1Y;
  oldOffsetX:number = 0;
  oldOffsetY:number = 0;
  containerDragging:boolean = false;

  storedText:string = '';

  frame:number = 0;

  deleting = false;

  constructor(private _reviewService: ReviewService){}

  ngOnInit() {}

  containerMouseDown(event) {
    console.log('container mouse down');

    if (event.shiftKey == false) return;

    console.log('add annotation');

    let x = event.offsetX;
    let y = event.offsetY;

    let width = event.target.clientWidth;
    let height = event.target.clientHeight;

    this.updateContainerDimensions();

    let xPerc = (x / width) * 100;
    let yPerc = (y / height) * 100;

    let text = ' ';

    let annotation = new Annotation();

    annotation.x = xPerc;
    annotation.y = yPerc;
    annotation.author = 'Mike Battcock';

    annotation.date = new Date();
    annotation.frame = this._reviewService.frame;

    this.annotations.push(annotation);

    this.selectedAnnotation = annotation;

    this.oldOffsetX = annotation.offsetX;
    this.oldOffsetY = annotation.offsetY;

    this.selectedAnnotation.offsetX = annotation.offsetX;
    this.selectedAnnotation.offsetY = annotation.offsetY;

    this.calcLine();

    this.dragging = true;

    let obj = [annotation,1];
    this.updateComment.emit(obj);
  }

  containerMouseMove(event) {
    if (this.dragging) {
      // mouse position
      let x = event.clientX - this.offsetLeft;
      let y = event.clientY - this.offsetTop;

      this.dragAnnotation(x,y);
    }
    else if (this.containerDragging) {
      this.dragAnnotationText(event.pageX - this.offsetLeft, event.pageY - this.offsetTop);
    }
    else {
      return false;
    }

    // calculate angle for connecting line
    this.calcLine();

    return false;
  }

  dragAnnotation(x,y) {
    let xPerc = this.clamp((x / this.width),0,1) * 100;
    let yPerc = this.clamp((y / this.height),0,1) * 100;

    this.selectedAnnotation.x = xPerc;
    this.selectedAnnotation.y = yPerc;

    let col = [0,0];

    col = this.calcCollision(x,y);

    this.selectedAnnotation.offsetX = this.oldOffsetX + col[0];
    this.selectedAnnotation.offsetY = this.oldOffsetY + col[1];

    // if mouse is going over annotation bounce it over
    // if (this.selectedAnnotation.colOffsetX < 0 && this.selectedAnnotation.colOffsetY < 0) {
    //   console.log('bounce over');
    //   this.selectedAnnotation.colOffsetX -= (this.width - (event.clientX - this.offsetLeft)) + 5;
    // }
  }

  dragAnnotationText(mouseX,mouseY) {
    let x = this.oldOffsetX + (mouseX-this.pos1X);
    let y = this.oldOffsetY + (mouseY-this.pos1Y);

    let col = this.calcCollision(mouseX,mouseY);

    x += col[0];
    y += col[1];

    this.selectedAnnotation.offsetX = x;
    this.selectedAnnotation.offsetY = y;
  }

  calcCollision(x,y) {
    let collisionLeft = x + this.annotationDim.left;
    let collisionRight = this.width - x - this.annotationDim.right;
    let collisionBottom = this.height - y - this.annotationDim.bottom;
    let collisionTop = this.annotationDim.top - y;

    //collisionLeft += this.colBounce;

    let colLeft = 0;
    let colRight = 0;
    let colTop = 0;
    let colBottom = 0;

    let colBounce = 0;

    if (collisionTop > 0) {
      colTop = collisionTop;
    }
    else if (collisionBottom < 0) {
      colBottom = collisionBottom;
    }
    if (collisionLeft < 0) {
      colLeft = -collisionLeft;
    }
    else if (collisionRight < 0) {
      colRight = collisionRight;
    }

    let colPadding = 0;//this.selectedAnnotationEl.offsetWidth;

    //if mouse is going over annotation bounce it over
    if (this.selectedAnnotation.offsetX < colPadding && this.selectedAnnotation.offsetY < colPadding) {
      if (this.selectedAnnotation.offsetX > -this.selectedTextBoxEl.offsetWidth && colBottom < 0 && colRight < 0) {
        colBounce = -(this.width - x);
      }
    }

    return ([colLeft + colRight + colBounce, colBottom+colTop]);
  }

  calcLine() {
    let x = this.selectedAnnotation.offsetX;
    let y = this.selectedAnnotation.offsetY;

    this.selectedAnnotation.lineRot = (Math.atan2(y, x) * 180 / Math.PI);
    this.selectedAnnotation.lineLen = Math.sqrt( x*x + y*y );
  }
  containerMouseUp(event) {
    this.dragging = false;
    this.containerDragging=false;
    if (this.selectedAnnotation.text == ' ') {
      this.selectedAnnotation.text = '';
    }
  }

  containerMouseLeave(event) {
    this.dragging=false; 
    this.containerDragging=false;  
  }

  calcAnnotationDim(x,y) {
    let bbox1 = this.selectedAnnotationEl.getBoundingClientRect();  // annotation marker
    let bbox2 = this.selectedTextBoxEl.getBoundingClientRect();  // annotation text box

    let left,top,right,bottom;

    if (this.containerDragging) {
      left = x;
      top = y;
      right = bbox2.width - x;
      bottom = bbox2.height - y;
    }
    else {
      left = bbox2.left - bbox1.left - (bbox1.width/2);
      top = bbox1.top - bbox2.top + (bbox1.height/2);
      right = bbox2.right - bbox1.right + (bbox1.width/2);
      bottom = bbox2.bottom - bbox1.bottom + (bbox1.height/2);
    }

    this.annotationDim = {
      'left':left,
      'top':top,
      'right':right,
      'bottom':bottom
    }
  }

  updateContainerDimensions() {
    this.width = this.annotationContainer.nativeElement.offsetWidth;
    this.height = this.annotationContainer.nativeElement.offsetHeight;

    let bound = this.annotationContainer.nativeElement.getBoundingClientRect();

    this.offsetLeft = bound.left;
    this.offsetTop = bound.top;
  }
  
  annotationMouseDown(annotation, event,i) {
    event.stopPropagation();

    console.log(annotation);

    this.updateContainerDimensions();

    // update selected annotation
    this.selectedAnnotation = annotation;
    this.selectedAnnotationEl = this.myAnnotations.toArray()[i].nativeElement;

    this.selectedTextBoxEl = this.selectedAnnotationEl.childNodes[3];

    this.calcAnnotationDim(event.offsetX,event.offsetY);

    this.oldOffsetX = this.selectedAnnotation.offsetX;
    this.oldOffsetY = this.selectedAnnotation.offsetY;



    if (event.which>1 || event.target.className != 'annotation') {
      console.log('annotationMouseDown: return');
      console.log(event);
      
      return false;
    }

    this.dragging = true;
    
    return false;
  }

  textContainerMouseDown(event) {
    console.log('textContainerMouseDown');
    console.log(event);
    // if clicked element is
    if (event.target.placeholder == "Comment") {
      console.log('comment clicked');
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    this.updateContainerDimensions();

    this.pos1X = event.pageX - this.offsetLeft;
    this.pos1Y = event.pageY - this.offsetTop;

    this.containerDragging = true;

    this.oldOffsetX = this.selectedAnnotation.offsetX;
    this.oldOffsetY = this.selectedAnnotation.offsetY;
  }

  textContainerMouseUp(event) {
    console.log('text container mouse up');

    this.containerDragging = false;

    if (this.deleting == true) {
      this.deleting = false;
      return;
    }

    let obj = [this.selectedAnnotation,2];
    this.updateComment.emit(obj);
  }



  inputMouseDown(e) {
    console.log(e);
    this.storedText = e.target.value;
    this.clearEvents(e);
  }

  clearEvents(e) {
    console.log('clear events');
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  updateAnnotation(event) {
    this.containerDragging = false;
    this.dragging = false;
    console.log('annotation.component: update annotation');

    if (this.deleting == true) {
      this.deleting = false;
      return;
    }

    let obj = [this.selectedAnnotation,2];
    this.updateComment.emit(obj);
  }

  deleteAnnotation(annotation) {
    this.deleting = true;

    let obj = [annotation,0];
    this.updateComment.emit(obj);
  }

  annotationKeyPress(e,annotation,input) {
    if (e.keyCode === 13) {

      if (e.ctrlKey) {
        annotation.text += "\n";
        
        console.log('ctrl enter key');
      }
      else {
        console.log('remove focus');
        //input.focused = 0;
        let obj = [annotation,2];
        this.updateComment.emit(obj);
        e.preventDefault();
      }
    }
    else if (e.keyCode === 27) {
      annotation.text = this.storedText;
    }
  }

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  };
}
