import { CollectionObject } from './collection-object.model';

export interface IJob extends CollectionObject {
  name: string;
  client: string;
  agency: string;
  thumbUrl?: string;
  camera? : {
    body: string;
    sensor: {
      width: number;
      height: number;
    }
    res: {
      width: number;
      height: number;
    }
  };
  output?: {
    fps: number;
    width: number;
    height: number;
    lengths: string[];
  };
  path?: string;
  public: boolean;
}

export class Job implements IJob {
  _id:any = {};
  name:string = '';
  client:string = '';
  agency:string = '';
  thumbUrl:string = '';
  camera:any = {
    body: '',
    sensor: {
      width: 0,
      height: 0,
    },
    res: {
      width: 0,
      height: 0,
    }
  };
  output:any = {
    fps: 25,
    width: 1920,
    height: 1080,
    lengths: [],
  };
  path:string =  '';
  public:boolean = true;
}

