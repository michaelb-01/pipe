import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IAnnotation, Annotation } from './annotation.model';

import template from './annotation.component.html';

@Component({
  providers: [],
  styles: [
  `
    :host {
      width:100%;
      position: relative;
    }
    .annotationContainer {
      position: relative;
      width:80%; 
      height:400px; 
      background-color:#fde;
      z-index:0;
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
      z-index: 1;
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

  frame:number = 0;

  constructor(){}

  containerMouseDown(event) {
    if (event.shiftKey == false) return;

    let x = event.offsetX;
    let y = event.offsetY;

    let width = event.target.clientWidth;
    let height = event.target.clientHeight;

    let bound = this.annotationContainer.nativeElement.getBoundingClientRect();

    this.width = width;
    this.height = height;

    this.offsetLeft = bound.left;
    this.offsetTop = bound.top;

    let xPerc = (x / width) * 100;
    let yPerc = (y / height) * 100;

    let text = ' ';

    let annotation = new Annotation();

    annotation.x = xPerc;
    annotation.y = yPerc;
    annotation.author = 'Mike Battcock';

    this.annotations.push(annotation);

    this.selectedAnnotation = annotation;

    this.oldOffsetX = annotation.offsetX;
    this.oldOffsetY = annotation.offsetY;

    this.selectedAnnotation.offsetX = annotation.offsetX;
    this.selectedAnnotation.offsetY = annotation.offsetY;

    this.calcLine();

    this.dragging = true;

    console.log('container mouse down');
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

    let col = this.calcCollision(x,y);

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
    console.log('container mouse leave');
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
  
  annotationMouseDown(annotation, event,i) {
    event.stopPropagation();
    console.log('annotation mouse down');

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
    this.pos1X = event.pageX - this.offsetLeft;
    this.pos1Y = event.pageY - this.offsetTop;

    this.containerDragging = true;

    this.oldOffsetX = this.selectedAnnotation.offsetX;
    this.oldOffsetY = this.selectedAnnotation.offsetY;
  }

  textContainerMouseUp(event) {
    console.log('text container mouse up');

    this.containerDragging = false;
  }

  deleteAnnotation(i) {
    this.annotations.splice(i,1);
  }

  annotationKeyPress(e,annotation,input) {
    if (e.keyCode === 13) {

      if (e.ctrlKey) {
        annotation.text += "\n";
        
        console.log('ctrl enter key');
      }
      else {
        console.log('remove focus');
        input.focused = 0;
        e.preventDefault();
      }
    }
  }

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  };
}
