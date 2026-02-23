'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AboutContent, TimelineEntry } from '@/lib/about-defaults'

const INPUT_CLS =
  'w-full border border-gray-200 focus:border-accent px-3 py-2 text-sm text-gray-800 outline-none transition-colors font-sans'
const LABEL_CLS = 'font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-1.5'

export default function AboutEditor({ initial }: { initial: AboutContent }) {
  const [bio, setBio] = useState<string[]>(initial.bioParagraphs)
  const [skills, setSkills] = useState<string[]>(initial.skills)
  const [timeline, setTimeline] = useState<TimelineEntry[]>(initial.timeline)
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioParagraphs: bio, skills, timeline }),
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

  // ── Bio helpers ──────────────────────────────────────────────────────────
  function updateBio(i: number, val: string) {
    setBio((prev) => prev.map((p, idx) => (idx === i ? val : p)))
  }
  function addBio() {
    setBio((prev) => [...prev, ''])
  }
  function removeBio(i: number) {
    setBio((prev) => prev.filter((_, idx) => idx !== i))
  }

  // ── Skills helpers ───────────────────────────────────────────────────────
  function addSkill() {
    const trimmed = newSkill.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills((prev) => [...prev, trimmed])
    setNewSkill('')
  }
  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  // ── Timeline helpers ─────────────────────────────────────────────────────
  function updateEntry(i: number, field: keyof TimelineEntry, val: string) {
    setTimeline((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e))
    )
  }
  function removeEntry(i: number) {
    setTimeline((prev) => prev.filter((_, idx) => idx !== i))
  }
  function moveEntry(i: number, dir: -1 | 1) {
    const next = [...timeline]
    const swap = next[i + dir]
    next[i + dir] = next[i]
    next[i] = swap
    setTimeline(next)
  }
  function addEntry() {
    setTimeline((prev) => [
      { date: '', role: '', company: 'AmcoGiffen', description: '' },
      ...prev,
    ])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-medium text-gray-900">About Page</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
          <p className="text-gray-400 text-xs font-mono">Edit bio, skills and career timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Preview →
          </a>
          {saved && (
            <span className="font-mono text-xs text-accent">Saved ✓</span>
          )}
          {error && (
            <span className="font-mono text-xs text-red-500">{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Bio Paragraphs ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest">Bio Paragraphs</h2>
          <button
            onClick={addBio}
            className="font-mono text-xs px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add Paragraph
          </button>
        </div>
        <div className="space-y-4">
          {bio.map((para, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <label className={LABEL_CLS}>Paragraph {i + 1}</label>
                {bio.length > 1 && (
                  <button
                    onClick={() => removeBio(i)}
                    className="font-mono text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                value={para}
                onChange={(e) => updateBio(i, e.target.value)}
                rows={3}
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-5">Technical Skills</h2>

        {/* Existing skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-gray-300 hover:text-red-500 transition-colors leading-none"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            placeholder="New skill…"
            className="flex-1 border border-gray-200 focus:border-accent px-3 py-2 text-sm outline-none transition-colors font-mono"
          />
          <button
            onClick={addSkill}
            className="font-mono text-xs px-4 py-2 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add
          </button>
        </div>
      </div>

      {/* ── Career Timeline ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest">Career Timeline</h2>
          <button
            onClick={addEntry}
            className="font-mono text-xs px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add Entry
          </button>
        </div>

        <div className="space-y-6">
          {timeline.map((entry, i) => (
            <div key={i} className="border border-gray-100 p-4 relative">

              {/* Move / Remove controls */}
              <div className="flex items-center gap-2 absolute top-3 right-3">
                {i > 0 && (
                  <button
                    onClick={() => moveEntry(i, -1)}
                    className="font-mono text-[10px] text-gray-400 hover:text-gray-700 transition-colors px-1"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {i < timeline.length - 1 && (
                  <button
                    onClick={() => moveEntry(i, 1)}
                    className="font-mono text-[10px] text-gray-400 hover:text-gray-700 transition-colors px-1"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => removeEntry(i)}
                  className="font-mono text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={LABEL_CLS}>Date range</label>
                  <input
                    type="text"
                    value={entry.date}
                    onChange={(e) => updateEntry(i, 'date', e.target.value)}
                    placeholder="e.g. Apr 2025 – Present"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Role / Title</label>
                  <input
                    type="text"
                    value={entry.role}
                    onChange={(e) => updateEntry(i, 'role', e.target.value)}
                    placeholder="e.g. Design Engineer"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Company</label>
                  <input
                    type="text"
                    value={entry.company}
                    onChange={(e) => updateEntry(i, 'company', e.target.value)}
                    placeholder="e.g. AmcoGiffen"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Description</label>
                <textarea
                  value={entry.description}
                  onChange={(e) => updateEntry(i, 'description', e.target.value)}
                  rows={3}
                  className={INPUT_CLS}
                />
              </div>
            </div>
          ))}
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
