'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMPLATE_HEADERS =
  'title,reference,sector,client,contractValue,designFee,contract,description,role,latitude,longitude,location,startDate,endDate,isOngoing,published,skills'
const TEMPLATE_EXAMPLE =
  '"Example Bridge","REF-001","Rail","Network Rail","£500,000","£25,000","NR4(MT)","Project description.","Design Engineer",51.5074,-0.1278,"London","Jan 2024","Dec 2024","false","true","Bridge Design|Eurocodes|AutoCAD"'

function downloadTemplate() {
  const csv = TEMPLATE_HEADERS + '\n' + TEMPLATE_EXAMPLE
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'projects-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminImportButton() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ count: number; errors: string[]; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleClose() {
    setOpen(false)
    setFile(null)
    setResult(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleImport() {
    if (!file) return
    setImporting(true)
    setError(null)
    setResult(null)

    try {
      const text = await file.text()
      const res = await fetch('/api/projects/import', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Import failed')
      } else {
        setResult(data)
        if (data.count > 0) router.refresh()
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs px-4 py-2 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
      >
        ↑ Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-gray-200 w-full max-w-lg shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-mono text-sm font-medium text-gray-900">Import Projects</h2>
                <p className="text-xs text-gray-400 mt-0.5">Upload a CSV file to bulk-add projects</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none p-1"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5">

              {/* Template download */}
              <div className="bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-700 font-medium">CSV Template</p>
                  <p className="text-xs text-gray-400 mt-0.5">Download the expected column format</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="font-mono text-xs px-3 py-1.5 border border-gray-300 text-gray-600 hover:border-accent hover:text-accent transition-all"
                >
                  ↓ Download
                </button>
              </div>

              {/* Required columns reference */}
              <div>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Required columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {['title', 'sector', 'client', 'description', 'role', 'latitude', 'longitude', 'location', 'startDate'].map((col) => (
                    <span key={col} className="font-mono text-[10px] bg-green-50 text-accent border border-green-200 px-2 py-0.5">
                      {col}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Sector must be one of: <span className="font-mono">Rail</span>, <span className="font-mono">Industrial/Mining</span>, <span className="font-mono">Environment</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  <span className="font-mono">skills</span> column is optional — use pipe-separated values, e.g. <span className="font-mono">Bridge Design|Eurocodes</span>
                </p>
              </div>

              {/* File input */}
              <div>
                <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-2">
                  Select CSV file
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null)
                    setResult(null)
                    setError(null)
                  }}
                  className="w-full text-xs text-gray-600 border border-gray-200 px-3 py-2 font-mono file:mr-3 file:py-1 file:px-3 file:border file:border-gray-200 file:text-xs file:font-mono file:text-gray-500 file:bg-white hover:file:border-gray-300"
                />
              </div>

              {/* Result / error feedback */}
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-600 font-mono">{error}</p>
                </div>
              )}

              {result && (
                <div className={`border px-4 py-3 ${result.count > 0 ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                  <p className={`text-xs font-mono font-medium ${result.count > 0 ? 'text-green-700' : 'text-amber-700'}`}>
                    {result.count} of {result.total} projects imported successfully
                  </p>
                  {result.errors.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {result.errors.map((e, i) => (
                        <li key={i} className="text-[11px] text-amber-600 font-mono">{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleClose}
                className="font-mono text-xs px-4 py-2 border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
              >
                {result?.count ? 'Done' : 'Cancel'}
              </button>
              {!result?.count && (
                <button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="btn-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing…' : 'Import Projects'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
