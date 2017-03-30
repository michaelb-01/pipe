//
// ===== File globals.ts    
//
'use strict';

export const jobRoots=['/Users/michaelbattcock/Documents/VFX/site_pipe/jobs'];

export const jobStructure={
  'mediashuttle':{
    'share':true,
    'name':true
  },
  'offline':{
    'edl':true
  },
  'online':{
    '01_source':{
      "audio":true,
      "footage":true,
      "graphics":true,
      "shoot_stills":true
    },
    "02_conform":{
      "davinci":true,
      "nukestudio":true
    },
    "03_grade":true,
    "04_wips":true,
    "05_masters":true
  },
  "production":{
    "storyboard":true,
    "script":true
  },
  "vfx":{
    "assets":true,
    "previs":true,
    "rnd":true,
    "shots":true
  }
}  

export const shotStructure = {
  '_published_2d':{
    'backplates':true,
    'renders':true,
    'mattes':true
  },
  '_published_3d':{
    'assets':true,
    'renders':true
  },
  'source':true
}
