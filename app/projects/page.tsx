'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { MapProject } from '@/components/MapClient'

const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false })

const ALL_SECTORS = ['Rail', 'Industrial/Mining', 'Environment']

function sectorBadgeClass(sector: string) {
  if (sector === 'Rail') return 'badge-rail'
  if (sector.includes('Mining') || sector.includes('Industrial')) return 'badge-mining'
  return 'badge-environment'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<MapProject[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>(ALL_SECTORS)
  const [loading, setLoading] = useState(true)
  const [focusId, setFocusId] = useState<string | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // On mobile, start with sidebar closed so the map is visible
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

  // Read ?focus=<id> from the URL (set when navigating from the hero map)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('focus')
    if (id) setFocusId(id)
  }, [])

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { setProjects(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    )
  }

  const visibleCount = projects.filter((p) => selectedSectors.includes(p.sector)).length

  return (
    <div className="relative flex h-screen pt-14 bg-white overflow-hidden">

      {/* Mobile backdrop — tap outside sidebar to close */}
      {sidebarOpen && (
        <div
          className="md:hidden absolute inset-0 z-10 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — absolute overlay on mobile, inline on desktop */}
      <aside
        className={`
          absolute md:relative inset-y-0 left-0 z-20
          flex-shrink-0 border-r border-gray-100 flex flex-col overflow-hidden bg-white
          transition-[width] duration-200
          ${sidebarOpen ? 'w-72 shadow-2xl md:shadow-none' : 'w-0'}
        `}
      >
        {/* Inner wrapper is always w-72 so content doesn't wrap during animation */}
        <div className="w-72 h-full flex flex-col">

          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs text-accent tracking-widest uppercase mb-1">
                Projects Map
              </div>
              <div className="text-gray-400 text-xs">
                {loading ? 'Loading…' : `${visibleCount} of ${projects.length} shown`}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 text-xl leading-none"
              aria-label="Close filters"
            >
              ×
            </button>
          </div>

          {/* Sector filters */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-3">
              Filter by sector
            </div>
            <div className="space-y-1.5">
              {ALL_SECTORS.map((sector) => {
                const count = projects.filter((p) => p.sector === sector).length
                const active = selectedSectors.includes(sector)
                return (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono border transition-all ${
                      active
                        ? sectorBadgeClass(sector)
                        : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span>{sector}</span>
                    <span className="opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="px-5 py-10 text-center">
                <div className="text-gray-400 text-xs">Loading projects…</div>
              </div>
            ) : (
              <div>
                {projects
                  .filter((p) => selectedSectors.includes(p.sector))
                  .map((project) => (
                    <a
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block px-5 py-3.5 border-b border-gray-50 hover:bg-green-50 transition-colors group"
                    >
                      <div className={`inline-block font-mono text-[10px] px-2 py-0.5 mb-1.5 ${sectorBadgeClass(project.sector)}`}>
                        {project.sector}
                      </div>
                      <div className="text-gray-800 text-xs font-medium leading-snug group-hover:text-accent transition-colors">
                        {project.title}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">{project.location}</div>
                    </a>
                  ))}
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* Map area */}
      <div className="flex-1 relative bg-gray-50">

        {/* Filters toggle button — shown when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 bg-white border border-gray-200 px-3 py-1.5 text-xs font-mono text-gray-600 hover:border-accent hover:text-accent transition-all shadow-sm flex items-center gap-1.5"
            style={{ zIndex: 1000 }}
          >
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="13" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="4" width="10" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="8" width="7" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
            Filters
          </button>
        )}

        {!loading && (
          <MapClient
            projects={projects}
            selectedSectors={selectedSectors}
            focusId={focusId}
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Initialising map…</span>
          </div>
        )}
      </div>
    </div>
  )
}
