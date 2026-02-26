'use client'

import { useState } from 'react'
import AdminProjectRow from './AdminProjectRow'

interface Project {
  id: string
  title: string
  sector: string
  location: string
  startDate: string
  endDate: string | null
  isOngoing: boolean
  published: boolean
  pinned: boolean
}

export default function AdminProjectList({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase()) ||
        p.sector.toLowerCase().includes(query.toLowerCase())
      )
    : projects

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 flex-shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, location or sector…"
          className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none font-mono bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
        {query && (
          <span className="font-mono text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Title', 'Sector', 'Location', 'Period', 'Published', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-widest font-normal ${i >= 4 ? 'text-center' : 'text-left'} ${i === 5 ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <AdminProjectRow key={project.id} project={project} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-mono text-xs text-gray-400">
                  No projects match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
