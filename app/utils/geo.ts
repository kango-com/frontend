import type { Coordinates } from '~/types'

/** Прямоугольник [запад, юг, восток, север] */
export type Bounds = [number, number, number, number]

/** Точка внутри прямоугольника */
export const inBounds = (p: Coordinates, b: Bounds) => p.lng >= b[0] && p.lng <= b[2] && p.lat >= b[1] && p.lat <= b[3]

/** Точка внутри многоугольника (метод луча); многоугольник не обязан быть замкнут */
export function inPolygon(p: Coordinates, poly: Coordinates[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!
    const b = poly[j]!
    if ((a.lat > p.lat) !== (b.lat > p.lat) && p.lng < ((b.lng - a.lng) * (p.lat - a.lat)) / (b.lat - a.lat) + a.lng) inside = !inside
  }
  return inside
}

/** Нарисованный от руки контур: выкидываем почти совпадающие соседние точки, чтобы многоугольник был лёгким */
export function simplifyPath(points: Coordinates[], minStep = 0.0004): Coordinates[] {
  const out: Coordinates[] = []
  for (const p of points) {
    const last = out.at(-1)
    if (!last || Math.hypot(p.lat - last.lat, p.lng - last.lng) >= minStep) out.push(p)
  }
  return out
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/**
 * Приблизительная область для объявления со скрытым адресом: центр сдвинут от настоящей точки
 * на 100-250 м в устойчивом (по id) направлении, чтобы точку нельзя было вычислить по центру круга.
 */
export function approximateCenter(p: Coordinates, id: string): Coordinates {
  const h = hash(id)
  const angle = (h % 360) * (Math.PI / 180)
  const meters = 100 + (h % 150)
  const dLat = (meters / 111_320) * Math.sin(angle)
  const dLng = (meters / (111_320 * Math.cos((p.lat * Math.PI) / 180))) * Math.cos(angle)
  return { lat: p.lat + dLat, lng: p.lng + dLng }
}

/** Круг радиусом `meters` как многоугольник [lng, lat][] (для слоя приблизительной области) */
export function circlePolygon(c: Coordinates, meters: number, steps = 48): [number, number][] {
  const out: [number, number][] = []
  const kLat = meters / 111_320
  const kLng = meters / (111_320 * Math.cos((c.lat * Math.PI) / 180))
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    out.push([c.lng + kLng * Math.cos(a), c.lat + kLat * Math.sin(a)])
  }
  return out
}

/** Ссылки на маршрут во внешних приложениях (Договор, Прил. 1, п. 9 «Карта в карточке») */
export function routeLinks(p: Coordinates) {
  const ll = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
  return {
    waze: `https://waze.com/ul?ll=${ll}&navigate=yes`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${ll}`,
    /** Открыть точку на карте OpenStreetMap */
    osm: `https://www.openstreetmap.org/?mlat=${p.lat.toFixed(6)}&mlon=${p.lng.toFixed(6)}#map=17/${ll.replace(',', '/')}`
  }
}
