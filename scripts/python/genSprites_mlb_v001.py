import os
import subprocess
import json
import shlex
import math

path = '/usr/local/bin'

if path not in os.environ["PATH"]:
    os.environ["PATH"] += os.pathsep + path

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

def createThumbnails(file):
    data = probeFile(file)

    maxThumbs = 30
    thumbWidth = 320

    # find duration 
    duration = data['streams'][0]['duration']
    frameRate = data['streams'][0]['avg_frame_rate'].split('/')[0]

    numFrames = int(float(duration) * float(frameRate)) + 1
    #numFrames = end - start

    mod = int(math.ceil(numFrames*1.0 / maxThumbs))

    numTiles = (numFrames / mod) + 1

    print 'writing ' + str(numTiles)

    # find height and width
    height = data['streams'][0]['height']
    width = data['streams'][0]['width']

    print 'duration (seconds: ' + duration 
    print 'duration (frames): ' + str(numFrames)
    print frameRate

    print 'write every ' + str(mod) + ' frames'

    dir = os.path.dirname(file)
    parts = os.path.splitext(os.path.basename(file))

    outputFile = dir + '/' + parts[0] + '_sprites_' + str(numTiles*thumbWidth) + '.jpg'

    #mod = 100

    #eq(mod(50,1),1)
    #select='not(mod(n\,100))'

    filtersArr = [
        "select='not(mod(n\," + str(mod) + "))'",
        "scale=320:-1",
        "tile=" + str(numTiles) + "x1"
    ]

    filters = ",".join(filtersArr)

    print filters

    # -qscale:v controls the quality of the video
    # 2 is best quality, 31 is worst
    subprocess.Popen([
        'ffmpeg', 
        '-i', file,      # inputs
        '-vf', filters,   # video filters
        '-qscale:v', '4',
        '-vsync', 'vfr',
        outputFile
    ])
    

    #pipe = sp.Popen(command, stdout = sp.PIPE, bufsize=10**8)

sel = nuke.selectedNodes()

for n in sel:
    file = n['file'].value()
    print file
    createThumbnails(file)


#createThumbnails(file)