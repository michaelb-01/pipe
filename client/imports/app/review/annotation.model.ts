export interface IAnnotation {
  text:string;
  author: string;
  x:number;
  y:number;
  offsetX:number;
  offsetY:number;
  lineRot:number;
  lineLen:number;
  frame:number;
}

export class Annotation implements IAnnotation {
  _id:any = {};
  text:string = ' ';
  author:string = '';
  x:number = 0;
  y:number = 0;
  offsetX:number = 10;
  offsetY:number = 20;
  lineRot:number = 0;
  lineLen:number = 0;
  frame:number = 0;
}

