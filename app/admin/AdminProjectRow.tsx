'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function AdminProjectRow({ project }: { project: Project }) {
  const router = useRouter()
  const [published, setPublished] = useState(project.published)
  const [pinned, setPinned] = useState(project.pinned)
  const [deleting, setDeleting] = useState(false)

  const period = project.isOngoing
    ? `${project.startDate} – Present`
    : project.endDate
    ? `${project.startDate} – ${project.endDate}`
    : project.startDate

  async function togglePublished() {
    const next = !published
    setPublished(next)
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: next }),
    })
    router.refresh()
  }

  async function togglePinned() {
    const next = !pinned
    setPinned(next)
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: next }),
    })
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
    router.refresh()
  }

  let sectorCls = 'badge-rail'
  if (project.sector.includes('Mining') || project.sector.includes('Industrial')) sectorCls = 'badge-mining'
  else if (project.sector === 'Environment') sectorCls = 'badge-environment'

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePinned}
            title={pinned ? 'Pinned to hero map — click to unpin' : 'Click to pin to hero map'}
            className={`flex-shrink-0 transition-colors ${pinned ? 'text-accent' : 'text-gray-200 hover:text-gray-400'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
          <div className="text-gray-900 text-sm font-medium leading-snug max-w-xs">{project.title}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`font-mono text-xs px-2 py-0.5 ${sectorCls}`}>{project.sector}</span>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs">{project.location}</td>
      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{period}</td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={togglePublished}
          title={published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 transition-colors ${
            published ? 'bg-accent border-accent' : 'bg-gray-200 border-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              published ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/projects/${project.id}`}
            target="_blank"
            className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            View
          </Link>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="font-mono text-xs text-accent/70 hover:text-accent transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs text-red-300 hover:text-red-500 transition-colors disabled:opacity-40"
          >
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  )
}
