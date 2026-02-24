'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AboutPageContent, AboutFact } from '@/lib/about-page-defaults'

const INPUT_CLS =
  'w-full border border-gray-200 focus:border-accent px-3 py-2 text-sm text-gray-800 outline-none transition-colors font-sans'
const LABEL_CLS = 'font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-1.5'

export default function AboutPageEditor({ initial }: { initial: AboutPageContent }) {
  const [bio, setBio] = useState<string[]>(initial.bioParagraphs)
  const [facts, setFacts] = useState<AboutFact[]>(initial.facts)
  const [interests, setInterests] = useState<string[]>(initial.interests)
  const [newInterest, setNewInterest] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/about-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioParagraphs: bio, facts, interests }),
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
  function addBio() { setBio((prev) => [...prev, '']) }
  function removeBio(i: number) { setBio((prev) => prev.filter((_, idx) => idx !== i)) }

  // ── Facts helpers ────────────────────────────────────────────────────────
  function updateFact(i: number, field: keyof AboutFact, val: string) {
    setFacts((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)))
  }
  function addFact() { setFacts((prev) => [...prev, { label: '', value: '' }]) }
  function removeFact(i: number) { setFacts((prev) => prev.filter((_, idx) => idx !== i)) }
  function moveFact(i: number, dir: -1 | 1) {
    const next = [...facts]
    const swap = next[i + dir]
    next[i + dir] = next[i]
    next[i] = swap
    setFacts(next)
  }

  // ── Interests helpers ────────────────────────────────────────────────────
  function addInterest() {
    const trimmed = newInterest.trim()
    if (!trimmed || interests.includes(trimmed)) return
    setInterests((prev) => [...prev, trimmed])
    setNewInterest('')
  }
  function removeInterest(interest: string) {
    setInterests((prev) => prev.filter((s) => s !== interest))
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
          <p className="text-gray-400 text-xs font-mono">Edit bio, quick facts and interests</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/about"
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

      {/* ── Quick Facts ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest">Quick Facts</h2>
          <button
            onClick={addFact}
            className="font-mono text-xs px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add Fact
          </button>
        </div>

        <div className="space-y-3">
          {facts.map((fact, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => i > 0 && moveFact(i, -1)}
                  disabled={i === 0}
                  className="font-mono text-[10px] text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors px-1"
                  title="Move up"
                >↑</button>
                <button
                  onClick={() => i < facts.length - 1 && moveFact(i, 1)}
                  disabled={i === facts.length - 1}
                  className="font-mono text-[10px] text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors px-1"
                  title="Move down"
                >↓</button>
              </div>
              <input
                type="text"
                value={fact.label}
                onChange={(e) => updateFact(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 border border-gray-200 focus:border-accent px-3 py-2 text-sm text-gray-800 outline-none transition-colors font-mono"
              />
              <input
                type="text"
                value={fact.value}
                onChange={(e) => updateFact(i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 border border-gray-200 focus:border-accent px-3 py-2 text-sm text-gray-800 outline-none transition-colors"
              />
              <button
                onClick={() => removeFact(i)}
                className="font-mono text-[10px] text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
          {facts.length === 0 && (
            <p className="text-gray-400 text-xs font-mono">No facts yet — click &quot;+ Add Fact&quot;.</p>
          )}
        </div>
      </div>

      {/* ── Interests ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-5">Interests</h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="text-gray-300 hover:text-red-500 transition-colors leading-none"
                aria-label={`Remove ${interest}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
            placeholder="New interest…"
            className="flex-1 border border-gray-200 focus:border-accent px-3 py-2 text-sm outline-none transition-colors font-mono"
          />
          <button
            onClick={addInterest}
            className="font-mono text-xs px-4 py-2 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
          >
            + Add
          </button>
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
