#!/usr/bin/env bash
# Выгрузка карты в PMTiles из ежедневной сборки Protomaps (бесплатно, данные OpenStreetMap). Подробности - docs/map.md.
# Использование: scripts/fetch-map.sh [регион] [выходной файл]
#   регион: israel (вся страна, по умолчанию) или center (Гуш-Дан: Тель-Авив и окрестности - маленький файл для разработки)
# Нужен pmtiles CLI: https://github.com/protomaps/go-pmtiles/releases (Windows: go-pmtiles_*_Windows_x86_64.zip, pmtiles.exe в PATH)
# Вырезается только нужный прямоугольник по HTTP-диапазонам, вся планета (~140 ГБ) не скачивается.
# Размер файла можно уменьшить: MAXZOOM=14 scripts/fetch-map.sh (по умолчанию 15 - видны дома и номера).
set -euo pipefail

REGION="${1:-israel}"
OUT="${2:-public/maps/israel.pmtiles}"
case "$REGION" in
  israel) BBOX="34.2,29.45,35.95,33.35" ;; # запад,юг,восток,север: от Эйлата до Голан
  center) BBOX="34.65,31.85,35.0,32.2" ;;   # Гуш-Дан
  *) echo "неизвестный регион: $REGION (israel | center)" >&2; exit 1 ;;
esac
MAXZOOM="${MAXZOOM:-15}"

command -v pmtiles >/dev/null || { echo "нужен pmtiles CLI (см. комментарий в начале скрипта)" >&2; exit 1; }

# последняя доступная ежедневная сборка (бывает, что сегодняшней ещё нет)
SRC=""
for back in 0 1 2 3 4 5; do
  DAY="$(date -d "-${back} day" +%Y%m%d 2>/dev/null || date -v-"${back}"d +%Y%m%d)"
  if curl -fsI -m 20 "https://build.protomaps.com/${DAY}.pmtiles" >/dev/null; then SRC="https://build.protomaps.com/${DAY}.pmtiles"; break; fi
done
[ -n "$SRC" ] || { echo "не нашёл сборку Protomaps за последние 5 дней" >&2; exit 1; }

mkdir -p "$(dirname "$OUT")"
echo "источник: $SRC; регион=$REGION; bbox=$BBOX; maxzoom=$MAXZOOM -> $OUT"
pmtiles extract "$SRC" "$OUT" --bbox="$BBOX" --maxzoom="$MAXZOOM"
pmtiles show "$OUT" | head -6
