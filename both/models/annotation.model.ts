export interface IAnnotation {
  author: string;
  text:string;
  x:number;
  y:number;
  offsetX:number;
  offsetY:number;
  lineRot:number;
  lineLen:number;
  frame:number;
  date:Date;
}

export class Annotation implements IAnnotation {
  author:string = '';
  text:string = ' ';
  x:number = 0;
  y:number = 0;
  offsetX:number = 10;
  offsetY:number = 20;
  lineRot:number = 0;
  lineLen:number = 0;
  frame:number = 0;
  date:Date = new Date();
}

