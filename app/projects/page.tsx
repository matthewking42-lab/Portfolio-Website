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
    <div className="flex h-screen pt-14 bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="font-mono text-xs text-accent tracking-widest uppercase mb-1">
            Projects Map
          </div>
          <div className="text-gray-400 text-xs">
            {loading ? 'Loading…' : `${visibleCount} of ${projects.length} shown`}
          </div>
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
      </aside>

      {/* Map */}
      <div className="flex-1 relative bg-gray-50">
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
