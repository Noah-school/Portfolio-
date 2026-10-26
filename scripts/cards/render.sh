#!/bin/sh
# Renders each project card SVG to public/images/projects/<name>.webp (640x1024).
cd "$(dirname "$0")" || exit 1
for svg in *.svg; do
  name="${svg%.svg}"
  out="../../public/images/projects/$name.png"   # temporary, converted below
  google-chrome --headless=new --no-sandbox --hide-scrollbars --window-size=640,1024 \
    --screenshot="$(realpath -m "$out")" "file://$PWD/$svg" >/dev/null 2>&1
  convert "$out" -strip -quality 90 "${out%.png}.webp" && rm "$out"
done
