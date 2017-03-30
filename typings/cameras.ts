class sensor {
  width: number;
  height: number;
  constructor(width:number, height:number) {
    this.width = width;
    this.height = height;
  }
}

class format extends sensor {
    name: string;
    width: number;
    height: number;
    constructor(name: string, width: number, height: number, sensorWidth:number, sensorHeight:number) {
      super(sensorWidth, sensorHeight);
      this.name = name;
      this.width = width;
      this.height = height;
    }
}

export const cameras = [
  {
    'body':'Arri Alexa',
    'formats':[{
      'name': '',
      'width':2660, 'height':1620,
      'sensor':{
        'width':23.76, 'height':13.37
      }
    }]
  },

  {
    'body':'Arri Alexa Mini',
    'formats':[
      {
        'name': 'ProRes HD',
        'width':2660, 'height':1620,
        'sensor':{
          'width':23.76,
          'height':13.37
        }
      },
      {
        'name': 'ProRes 2K',
        'width':2668, 'height':1612,
        'sensor':{
          'width':23.65,
          'height':13.31
        }
      }
    ]
  },
]
