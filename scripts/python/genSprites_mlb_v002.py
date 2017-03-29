import os
import subprocess
import json
import shlex
import math
import nuke

def probeFile(file):
    cmd = "ffprobe -v quiet -print_format json -show_streams"
    
    # find video duration
    # ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1
    
    # find video frame rate (not working)
    # ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1
    
    args = shlex.split(cmd)
    args.append(file)
    
    res = subprocess.check_output(args).decode('utf-8')
    res = json.loads(res)
    
    return res

def createSprites(file,thumbWidth,maxFrames):
    ffmpegPath = '' 
    
    platform = sys.platform
    
    if platform == 'darwin':
        ffmpegPath = '/usr/local/bin'
    elif platform == 'win32':
        ffmpegPath = 'S:/3D_globalSettings/pipe/ffmpeg/bin/'
    else:
        'Platform (' + platform + ') not recognised. Exiting'
    
    if ffmpegPath not in os.environ["PATH"]:
        print 'Adding ffmpeg to path'
        os.environ["PATH"] += os.pathsep + ffmpegPath

    data = probeFile(file)

    # find duration 
    duration = data['streams'][0]['duration']
    frameRate = data['streams'][0]['avg_frame_rate'].split('/')[0]

    numFrames = int(float(duration) * float(frameRate))

    mod = max(1,float(numFrames) / maxFrames)

    print '\nVideo Data:'
    print 'duration (seconds: ' + duration 
    print 'duration (frames): ' + str(numFrames)

    print 'frame rate: ' + frameRate
    
    i = 1
    idx = 1

    eqFilter = ''   
    numTiles = 0 

    while i < numFrames:
        print 'Tile: ' + str(idx) + ", Frame: " + str(math.floor(i+0.5)) 
        eqFilter += 'eq(n,' +str(int(math.floor(i+0.5))) + ')+'
        numTiles += 1
        idx += 1
        i += mod
        
    print 'Outputting ' + str(numTiles) + ' frames out of a maximum of ' + str(maxFrames) + ' frames'
    print 'Outputting ~ every ' + str(mod) + ' frames'

    eqFilter = eqFilter[0:-1]  # remove last character which will be '+'

    # OUTPUT FILE #
    dir = os.path.dirname(file)
    parts = os.path.splitext(os.path.basename(file))

    outputFile = dir + '/' + parts[0] + '_sprites_' + str(numTiles*thumbWidth) + '.jpg'

    # FILTERS #
    filtersArr = [
        "select='" + eqFilter + "'",
        "scale=" + str(thumbWidth) + ":-1",
        "tile=" + str(numTiles) + "x1"
    ]

    filters = ",".join(filtersArr)

    # -qscale:v controls the image quality. 2 is best quality, 31 is worst
    subprocess.Popen([
        'ffmpeg', 
        '-i', file,      # inputs
        '-vf', filters,   # video filters
        '-qscale:v', '4', # quality
        '-vsync', 'vfr',
        outputFile
    ])

    return data

def getFilenames():
    sel = nuke.selectedNodes()

    if len(sel) < 1:
        print 'No nodes selected'
        return

    n = sel[0]
    file = n['file'].value()

    # filename, thumbWidth, maxFrames
    createSprites(file,320,30)

getFilenames()
