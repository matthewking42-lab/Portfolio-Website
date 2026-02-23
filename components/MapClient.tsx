'use client'

import { useEffect, useRef, useCallback } from 'react'

export interface MapProject {
  id: string
  title: string
  latitude: number
  longitude: number
  sector: string
  location: string
  client: string
  role: string
  startDate: string
  endDate: string | null
  isOngoing: boolean
}

interface MapClientProps {
  projects: MapProject[]
  selectedSectors: string[]
  focusId?: string
}

// Amber pin — stands out clearly against OSM tiles
const AMBER_PIN_SVG = `
<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 1C7.1 1 1.5 6.6 1.5 13.5C1.5 23.1 14 36.5 14 36.5C14 36.5 26.5 23.1 26.5 13.5C26.5 6.6 20.9 1 14 1Z" fill="#f5a623" stroke="#c47d10" stroke-width="1"/>
  <circle cx="14" cy="13.5" r="5" fill="#ffffff"/>
</svg>`

function popupHtml(project: MapProject): string {
  const period = project.isOngoing
    ? `${project.startDate} – Present`
    : project.endDate
    ? `${project.startDate} – ${project.endDate}`
    : project.startDate

  let badgeBg = '#eff6ff'; let badgeColor = '#1d4ed8'; let badgeBorder = '#bfdbfe'
  if (project.sector.includes('Mining') || project.sector.includes('Industrial')) {
    badgeBg = '#fffbeb'; badgeColor = '#b45309'; badgeBorder = '#fde68a'
  } else if (project.sector === 'Environment') {
    badgeBg = '#f0fdf4'; badgeColor = '#15803d'; badgeBorder = '#bbf7d0'
  }

  return `
    <div style="background:#fff;border:1px solid #e5e7eb;border-top:3px solid #16a34a;padding:14px 16px;min-width:220px;max-width:280px;font-family:'Inter',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.10)">
      <span style="display:inline-block;background:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:2px 8px;margin-bottom:6px">${project.sector}</span>
      <h3 style="color:#111827;font-size:13px;font-weight:600;margin:0 0 4px 0;line-height:1.3;font-family:'Inter',sans-serif">${project.title}</h3>
      <p style="color:#6b7280;font-size:12px;margin:0 0 1px 0">${project.location}</p>
      <p style="color:#9ca3af;font-size:11px;font-family:'IBM Plex Mono',monospace;margin:0 0 10px 0">${period}</p>
      <a href="/projects/${project.id}" style="display:inline-block;background:#16a34a;color:#fff;font-size:11px;padding:6px 14px;text-decoration:none;font-family:'IBM Plex Mono',monospace;letter-spacing:0.05em;font-weight:500">
        View Details →
      </a>
    </div>`
}

export default function MapClient({ projects, selectedSectors, focusId }: MapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const markerMapRef = useRef<Record<string, any>>({})
  const hasFocusedRef = useRef(false)
  const hasInitialFitRef = useRef(false)
  const LRef = useRef<any>(null)

  const renderMarkers = useCallback(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    markerMapRef.current = {}

    projects
      .filter((p) => selectedSectors.includes(p.sector))
      .forEach((project) => {
        const icon = L.divIcon({
          className: '',
          html: AMBER_PIN_SVG,
          iconSize: [28, 38],
          iconAnchor: [14, 38],
          popupAnchor: [0, -40],
        })

        const marker = L.marker([project.latitude, project.longitude], { icon })
        marker.bindPopup(popupHtml(project), { maxWidth: 300 })
        marker.addTo(map)
        markersRef.current.push(marker)
        markerMapRef.current[project.id] = marker
      })

    const visible = projects.filter((p) => selectedSectors.includes(p.sector))

    // One-time focus when arriving from hero map click
    if (focusId && !hasFocusedRef.current && markerMapRef.current[focusId]) {
      const project = projects.find((p) => p.id === focusId)
      if (project) {
        hasFocusedRef.current = true
        hasInitialFitRef.current = true // skip the initial fit too
        setTimeout(() => {
          if (!mapRef.current) return
          mapRef.current.flyTo([project.latitude, project.longitude], 14, {
            animate: true,
            duration: 1.2,
          })
          mapRef.current.once('moveend', () => {
            markerMapRef.current[focusId]?.openPopup()
          })
        }, 400)
        return
      }
    }

    // Fit the view to all currently visible projects
    if (visible.length === 0 || !mapRef.current || !L) return

    if (visible.length === 1) {
      const p = visible[0]
      if (!hasInitialFitRef.current) {
        hasInitialFitRef.current = true
        mapRef.current.setView([p.latitude, p.longitude], 12)
      } else {
        mapRef.current.flyTo([p.latitude, p.longitude], 12, { duration: 0.8 })
      }
    } else {
      const bounds = L.latLngBounds(visible.map((p) => [p.latitude, p.longitude]))
      if (!hasInitialFitRef.current) {
        hasInitialFitRef.current = true
        mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 })
      } else {
        mapRef.current.flyToBounds(bounds, { padding: [60, 60], maxZoom: 12, duration: 0.8 })
      }
    }
  }, [projects, selectedSectors, focusId])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      if (mapRef.current) return
      LRef.current = L

      const map = L.map(containerRef.current!, {
        center: [54.5, -2.5],
        zoom: 6,
        zoomControl: false,
      })
      L.control.zoom({ position: 'topright' }).addTo(map)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      renderMarkers()
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mapRef.current) renderMarkers()
  }, [renderMarkers])

  return <div ref={containerRef} className="w-full h-full" />
}
