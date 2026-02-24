'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AdminMapPicker = dynamic(() => import('./AdminMapPicker'), { ssr: false })

export interface ProjectFormData {
  id?: string
  title: string
  reference: string
  sector: string
  client: string
  contractValue: string
  designFee: string
  contract: string
  description: string
  role: string
  latitude: string
  longitude: string
  location: string
  startDate: string
  endDate: string
  isOngoing: boolean
  published: boolean
  pdfReport?: string | null
  skills: string[]
}

const defaultForm: ProjectFormData = {
  title: '',
  reference: '',
  sector: 'Rail',
  client: '',
  contractValue: '',
  designFee: '',
  contract: '',
  description: '',
  role: 'Design Engineer',
  latitude: '',
  longitude: '',
  location: '',
  startDate: '',
  endDate: '',
  isOngoing: false,
  published: true,
  skills: [],
}

const inputCls =
  'w-full border border-gray-200 focus:border-accent focus:outline-none px-3 py-2.5 text-gray-900 text-sm transition-colors bg-white'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="font-mono text-xs text-accent uppercase tracking-widest mb-5">{title}</h2>
      {children}
    </div>
  )
}

export default function ProjectForm({ initial, mode }: { initial?: Partial<ProjectFormData>; mode: 'new' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState<ProjectFormData>({ ...defaultForm, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState('')
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/about')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data?.skills)) setAvailableSkills(data.skills) })
      .catch(() => {})
  }, [])

  function set(field: keyof ProjectFormData, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  async function uploadPdf(): Promise<string | null> {
    const file = fileRef.current?.files?.[0]
    if (!file) return form.pdfReport ?? null
    setUploadProgress('Uploading…')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    setUploadProgress('')
    return data.filename
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const pdfReport = await uploadPdf()
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        pdfReport,
      }

      const res =
        mode === 'new'
          ? await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          : await fetch(`/api/projects/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Save failed')
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *">
            <input required className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project title" />
          </Field>
          <Field label="Reference">
            <input className={inputCls} value={form.reference} onChange={(e) => set('reference', e.target.value)} placeholder="e.g. SPC5-94" />
          </Field>
          <Field label="Sector *">
            <select required className={inputCls} value={form.sector} onChange={(e) => set('sector', e.target.value)}>
              <option value="Rail">Rail</option>
              <option value="Industrial/Mining">Industrial/Mining</option>
              <option value="Environment">Environment</option>
            </select>
          </Field>
          <Field label="Client *">
            <input required className={inputCls} value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Client name" />
          </Field>
          <Field label="Contract Value">
            <input className={inputCls} value={form.contractValue} onChange={(e) => set('contractValue', e.target.value)} placeholder="e.g. £430k" />
          </Field>
          <Field label="Role *">
            <input required className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Your role on project" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description *">
            <textarea required rows={4} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Project description…" />
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location — Click Map to Place Pin">
        <AdminMapPicker
          lat={form.latitude}
          lng={form.longitude}
          onPick={(lat, lng) => { set('latitude', String(lat)); set('longitude', String(lng)) }}
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field label="Latitude *">
            <input required className={inputCls} value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="54.5" />
          </Field>
          <Field label="Longitude *">
            <input required className={inputCls} value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="-2.5" />
          </Field>
          <Field label="Location Label *">
            <input required className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. York" />
          </Field>
        </div>
      </Section>

      {/* Dates */}
      <Section title="Dates">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Start Date *">
            <input required className={inputCls} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} placeholder="e.g. Aug 2023" />
          </Field>
          <Field label="End Date">
            <input className={inputCls} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} placeholder="e.g. Dec 2023" disabled={form.isOngoing} />
          </Field>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isOngoing} onChange={(e) => set('isOngoing', e.target.checked)} className="w-4 h-4 accent-accent" />
              <span className="text-gray-600 text-sm">Ongoing</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Technical Skills">
        {availableSkills.length === 0 ? (
          <p className="text-gray-400 text-xs font-mono">
            No skills defined yet — add them in{' '}
            <a href="/admin/about" className="text-accent underline">Edit Career</a>.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const checked = form.skills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                    checked
                      ? 'bg-accent-light border-accent-border text-accent'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {checked && <span className="mr-1">✓</span>}
                  {skill}
                </button>
              )
            })}
          </div>
        )}
      </Section>

      {/* PDF */}
      <Section title="PDF Report (optional)">
        {form.pdfReport && (
          <p className="text-gray-400 text-xs font-mono mb-3">Current: {form.pdfReport}</p>
        )}
        <Field label="Upload PDF">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="w-full text-gray-500 text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-gray-200 file:bg-gray-50 file:text-gray-600 file:font-mono file:text-xs file:cursor-pointer hover:file:bg-accent-light hover:file:border-accent-border hover:file:text-accent"
          />
        </Field>
        {uploadProgress && <p className="text-accent text-xs font-mono mt-2">{uploadProgress}</p>}
      </Section>

      {/* Publish toggle */}
      <div className="bg-white border border-gray-200 p-4 flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-gray-600 text-sm">Published (visible on public site)</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? 'Saving…' : mode === 'new' ? 'Create Project' : 'Save Changes'}
        </button>
        <a href="/admin" className="btn-secondary">Cancel</a>
      </div>
    </form>
  )
}
