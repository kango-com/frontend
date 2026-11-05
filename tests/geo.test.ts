import { describe, expect, it } from 'vitest'
import { approximateCenter, circlePolygon, inBounds, inPolygon, routeLinks, simplifyPath } from '../app/utils/geo'

const square = [{ lat: 32, lng: 34.7 }, { lat: 32, lng: 34.8 }, { lat: 32.1, lng: 34.8 }, { lat: 32.1, lng: 34.7 }]

describe('гео', () => {
  it('точка в прямоугольнике и в многоугольнике', () => {
    expect(inBounds({ lat: 32.05, lng: 34.75 }, [34.7, 32, 34.8, 32.1])).toBe(true)
    expect(inBounds({ lat: 32.2, lng: 34.75 }, [34.7, 32, 34.8, 32.1])).toBe(false)
    expect(inPolygon({ lat: 32.05, lng: 34.75 }, square)).toBe(true)
    expect(inPolygon({ lat: 32.05, lng: 34.9 }, square)).toBe(false)
  })

  it('упрощение контура убирает почти совпадающие точки', () => {
    const path = [{ lat: 32, lng: 34.7 }, { lat: 32.0001, lng: 34.7 }, { lat: 32.01, lng: 34.7 }]
    expect(simplifyPath(path)).toHaveLength(2)
  })

  it('приблизительный центр устойчив и лежит в 100-250 м от точки', () => {
    const p = { lat: 32.0853, lng: 34.7818 }
    const a = approximateCenter(p, 'a1001')
    expect(approximateCenter(p, 'a1001')).toEqual(a)
    const meters = Math.hypot((a.lat - p.lat) * 111_320, (a.lng - p.lng) * 111_320 * Math.cos((p.lat * Math.PI) / 180))
    expect(meters).toBeGreaterThanOrEqual(99)
    expect(meters).toBeLessThanOrEqual(251)
  })

  it('круг замкнут, ссылки маршрута содержат координаты', () => {
    const ring = circlePolygon({ lat: 32, lng: 34.8 }, 300, 8)
    expect(ring[0]![0]).toBeCloseTo(ring.at(-1)![0], 9)
    expect(routeLinks({ lat: 32.1, lng: 34.8 }).waze).toContain('32.100000,34.800000')
  })
})
