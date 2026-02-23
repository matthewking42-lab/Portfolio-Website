'use client'

import { useEffect, useRef } from 'react'

interface AdminMapPickerProps {
  lat: string
  lng: string
  onPick: (lat: number, lng: number) => void
}

const PIN_SVG = `
<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.4 18.6 0 12 0Z" fill="#16a34a" stroke="#14532d" stroke-width="1"/>
  <circle cx="12" cy="12" r="4" fill="#ffffff"/>
</svg>`

export default function AdminMapPicker({ lat, lng, onPick }: AdminMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      if (mapRef.current) return

      const initLat = parseFloat(lat) || 54.5
      const initLng = parseFloat(lng) || -2.5

      const map = L.map(containerRef.current!, {
        center: [initLat, initLng],
        zoom: parseFloat(lat) ? 10 : 6,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: PIN_SVG,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
      })

      if (parseFloat(lat) && parseFloat(lng)) {
        markerRef.current = L.marker([parseFloat(lat), parseFloat(lng)], { icon }).addTo(map)
      }

      map.on('click', (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng
        if (markerRef.current) markerRef.current.remove()
        markerRef.current = L.marker([clickLat, clickLng], { icon }).addTo(map)
        onPick(
          Math.round(clickLat * 10000) / 10000,
          Math.round(clickLng * 10000) / 10000
        )
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-64 border border-gray-200" />
      <div className="absolute top-2 right-2 bg-white/90 border border-gray-200 px-2 py-1 text-xs text-gray-400 pointer-events-none">
        Click to place pin
      </div>
    </div>
  )
}
