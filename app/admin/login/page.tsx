'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Incorrect password.')
        setPassword('')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="bg-white border border-gray-200 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-sm font-medium text-gray-900">Matthew King</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <p className="text-gray-500 text-sm">Admin access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full border border-gray-200 focus:border-accent focus:outline-none px-3 py-2.5 text-gray-900 text-sm transition-colors"
                placeholder="Enter password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
