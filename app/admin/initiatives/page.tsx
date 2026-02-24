import { prisma } from '@/lib/prisma'
import { DEFAULT_INITIATIVES } from '@/lib/initiatives-defaults'
import type { InitiativesContent } from '@/lib/initiatives-defaults'
import InitiativesEditor from './InitiativesEditor'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getInitiatives(): Promise<InitiativesContent> {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: 'initiatives' } })
    if (record) return JSON.parse(record.value) as InitiativesContent
  } catch {
    // Table not yet created — return defaults
  }
  return DEFAULT_INITIATIVES
}

export default async function AdminInitiativesPage() {
  const initial = await getInitiatives()

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href="/admin"
          className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Admin Dashboard
        </Link>
      </div>
      <InitiativesEditor initial={initial} />
    </main>
  )
}
