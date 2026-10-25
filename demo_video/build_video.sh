#!/bin/zsh
# Re-render the whole demo video:  ./demo_video/build_video.sh
# Needs: Playwright + Chrome (python), numpy/scipy, and an ffmpeg binary (set FFMPEG=/path/to/ffmpeg).
set -e
cd "${0:A:h}"
FFMPEG="${FFMPEG:-ffmpeg}"
PY="${PY:-python3}"
$PY music.py                                   # soundtrack -> audio/soundtrack.wav
rm -f frames/f*.jpg(N)
$PY render.py                                  # 2580 frames -> frames/
$FFMPEG -y -framerate 30 -i frames/f%05d.jpg -i audio/soundtrack.wav \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:v libx264 -preset medium -crf 22 -profile:v high -movflags +faststart \
  -c:a aac -b:a 192k -shortest ../FocusGuard_AI_Demo.mp4
echo "Done: ../FocusGuard_AI_Demo.mp4"
