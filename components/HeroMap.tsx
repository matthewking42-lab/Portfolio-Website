'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  latitude: number
  longitude: number
  sector: string
  location: string
}

const PIN_AMBER = `<svg width="18" height="26" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg"><path d="M14 1C7.1 1 1.5 6.6 1.5 13.5C1.5 23.1 14 36.5 14 36.5S26.5 23.1 26.5 13.5C26.5 6.6 20.9 1 14 1Z" fill="#f5a623" stroke="#c47d10" stroke-width="1.5"/><circle cx="14" cy="13.5" r="5" fill="#fff"/></svg>`
const PIN_GREEN = `<svg width="22" height="32" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg"><path d="M14 1C7.1 1 1.5 6.6 1.5 13.5C1.5 23.1 14 36.5 14 36.5S26.5 23.1 26.5 13.5C26.5 6.6 20.9 1 14 1Z" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/><circle cx="14" cy="13.5" r="5" fill="#fff"/></svg>`

export default function HeroMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{ id: string; marker: any }[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)
  const currentIdRef = useRef<string | null>(null)
  const router = useRouter()

  const [info, setInfo] = useState<{ title: string; location: string; sector: string } | null>(null)

  useEffect(() => {
    mountedRef.current = true
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      if (!mountedRef.current || mapRef.current) return

      const map = L.map(containerRef.current!, {
        center: [54.5, -2.5],
        zoom: 6,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Fetch pinned projects first; fall back to all published if none are pinned
      fetch('/api/projects?pinned=true')
        .then((r) => r.json())
        .then((pinned: Project[]) =>
          pinned.length > 0 ? pinned : fetch('/api/projects').then((r) => r.json())
        )
        .then((projects: Project[]) => {
          if (!mountedRef.current) return

          // Place all pins as amber initially
          projects.forEach((p) => {
            const icon = L.divIcon({
              className: '',
              html: PIN_AMBER,
              iconSize: [18, 26],
              iconAnchor: [9, 26],
            })
            const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map)
            markersRef.current.push({ id: p.id, marker })
          })

          function flyTo(index: number) {
            if (!mountedRef.current) return
            const project = projects[index]
            currentIdRef.current = project.id

            // Highlight active pin green, rest amber
            markersRef.current.forEach(({ marker }, i) => {
              const active = i === index
              marker.setIcon(
                L.divIcon({
                  className: '',
                  html: active ? PIN_GREEN : PIN_AMBER,
                  iconSize: active ? [22, 32] : [18, 26],
                  iconAnchor: active ? [11, 32] : [9, 26],
                })
              )
            })

            // Clear label for the duration of the flight
            setInfo(null)

            map.flyTo([project.latitude, project.longitude], 12, {
              animate: true,
              duration: 2.5,
            })

            // Wait for the flyTo animation to finish (2500ms + small buffer),
            // then show the label and dwell before flying to the next project.
            timerRef.current = setTimeout(() => {
              if (!mountedRef.current) return
              setInfo({ title: project.title, location: project.location, sector: project.sector })

              timerRef.current = setTimeout(() => {
                flyTo((index + 1) % projects.length)
              }, 3000)
            }, 2600)
          }

          // Brief overview of the UK, then start the tour
          timerRef.current = setTimeout(() => flyTo(0), 1500)
        })
    })

    return () => {
      mountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  function handleClick() {
    router.push(
      currentIdRef.current ? `/projects?focus=${currentIdRef.current}` : '/projects'
    )
  }

  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={handleClick}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Project info label — only rendered when landed on a project */}
      {info && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 px-4 py-3 pointer-events-none" style={{ zIndex: 1000 }}>
          <span className="font-mono text-[9px] text-accent tracking-widest uppercase">
            {info.sector}
          </span>
          <p className="text-gray-800 text-xs font-medium leading-snug mt-0.5 truncate">
            {info.title}
          </p>
          <p className="text-gray-400 text-[11px] mt-0.5">{info.location}</p>
        </div>
      )}

      {/* Hover hint */}
      <div className="absolute top-2.5 right-2.5 bg-white/85 px-2.5 py-1 text-[10px] font-mono text-gray-500 tracking-wider pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Click to explore →
      </div>
    </div>
  )
}
