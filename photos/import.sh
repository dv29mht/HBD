#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  Photo import helper
#
#  1. Drop ALL your photos into  photos/incoming/  (any names,
#     any format — jpg, png, webp, even iPhone .heic).
#  2. Name them so they sort in the order you want, e.g.
#       01.heic 02.jpg 03.png …   (or 1, 2, 3 …)
#  3. Run:   bash photos/import.sh
#
#  It converts everything to photo1.jpg … photoN.jpg in /photos.
# ──────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

shopt -s nullglob nocaseglob 2>/dev/null || true

i=1
count=0
for f in incoming/*.jpg incoming/*.jpeg incoming/*.png incoming/*.webp incoming/*.heic incoming/*.HEIC; do
  [ -e "$f" ] || continue
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "No images found in photos/incoming/ — drop your photos there first."
  exit 0
fi

# process in natural sorted order
while IFS= read -r f; do
  out="photo${i}.jpg"
  ext="${f##*.}"
  shopt -s nocasematch
  if [[ "$ext" == "heic" || "$ext" == "png" || "$ext" == "webp" ]]; then
    # convert to jpeg using macOS built-in `sips`
    sips -s format jpeg "$f" --out "$out" >/dev/null
  else
    cp "$f" "$out"
  fi
  shopt -u nocasematch
  echo "  $f  ->  $out"
  i=$((i + 1))
done < <(ls -1v incoming/*.jpg incoming/*.jpeg incoming/*.png incoming/*.webp incoming/*.heic incoming/*.HEIC 2>/dev/null)

echo "✓ Imported $((i - 1)) photos into /photos. Refresh the site to see them."
