'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Initiative, InitiativesContent } from '@/lib/initiatives-defaults'

const INPUT_CLS =
  'w-full border border-gray-200 focus:border-accent px-3 py-2 text-sm text-gray-800 outline-none transition-colors font-sans'
const LABEL_CLS = 'font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-1.5'

export default function InitiativesEditor({ initial }: { initial: InitiativesContent }) {
  const [items, setItems] = useState<Initiative[]>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/initiatives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function updateItem(i: number, field: keyof Initiative, val: string) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)))
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  function moveItem(i: number, dir: -1 | 1) {
    const next = [...items]
    const swap = next[i + dir]
    next[i + dir] = next[i]
    next[i] = swap
    // Auto-renumber
    setItems(next.map((item, idx) => ({ ...item, number: String(idx + 1).padStart(2, '0') })))
  }

  function addItem() {
    const number = String(items.length + 1).padStart(2, '0')
    setItems((prev) => [
      ...prev,
      { number, title: '', tag: '', description: '', outcome: '' },
    ])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-medium text-gray-900">Initiatives Page</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
          <p className="text-gray-400 text-xs font-mono">Add, edit, or remove initiative cards</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/initiatives"
            target="_blank"
            className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Preview →
          </a>
          {saved && <span className="font-mono text-xs text-accent">Saved ✓</span>}
          {error && <span className="font-mono text-xs text-red-500">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Initiative cards */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest">Initiatives</h2>
          <button
            onClick={addItem}
            className="font-mono text-xs px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add Initiative
          </button>
        </div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 p-4 relative">

              {/* Move / Remove controls */}
              <div className="flex items-center gap-2 absolute top-3 right-3">
                {i > 0 && (
                  <button
                    onClick={() => moveItem(i, -1)}
                    className="font-mono text-[10px] text-gray-400 hover:text-gray-700 transition-colors px-1"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {i < items.length - 1 && (
                  <button
                    onClick={() => moveItem(i, 1)}
                    className="font-mono text-[10px] text-gray-400 hover:text-gray-700 transition-colors px-1"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => removeItem(i)}
                  className="font-mono text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Number badge */}
              <div className="font-mono text-3xl font-light text-gray-200 mb-4 leading-none">
                {item.number}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={LABEL_CLS}>Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                    placeholder="Initiative title"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Tag</label>
                  <input
                    type="text"
                    value={item.tag}
                    onChange={(e) => updateItem(i, 'tag', e.target.value)}
                    placeholder="e.g. Efficiency & Knowledge"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={LABEL_CLS}>Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  rows={4}
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>Outcome</label>
                <input
                  type="text"
                  value={item.outcome}
                  onChange={(e) => updateItem(i, 'outcome', e.target.value)}
                  placeholder="e.g. Adopted across the design team."
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-gray-400 text-xs font-mono text-center py-6">
              No initiatives yet — click &quot;+ Add Initiative&quot; to get started.
            </p>
          )}
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && <span className="font-mono text-xs text-accent">Changes saved ✓</span>}
        {error && <span className="font-mono text-xs text-red-500">{error}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-xs disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

    </div>
  )
}
