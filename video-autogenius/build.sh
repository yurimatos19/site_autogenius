#!/bin/sh
# Refaz o filme inteiro: voz → checagem → eventos → trilha → mix → legendas → vídeo → master (−14 LUFS)
set -e
LIB=/Users/yurimatos/lemo-opuscar
HERE=$(cd "$(dirname "$0")" && pwd)
export LIB
PY="$LIB/.venv/bin/python"
cd "$LIB"
"$PY" core/tts/tts_zh.py "$HERE/lines.json" "$HERE/voice" --voice pt-BR-AntonioNeural --rate=-4%
"$PY" core/tts/asr_check.py "$HERE/lines.json" "$HERE/voice" --lang pt --model small
node core/render/events.mjs "$HERE"
node core/render/readcheck.mjs "$HERE"
"$PY" "$HERE/music/score.py"
"$PY" "$HERE/mix.py"
"$PY" "$HERE/srt.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/autogenius-1-minuto.mp4" 24 0
node core/render/still.mjs "$HERE" 57.5 --out "$HERE/out" && cp "$HERE/out/t_57.5.jpg" "$HERE/poster.jpg"
