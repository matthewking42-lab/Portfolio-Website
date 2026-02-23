import { prisma } from '@/lib/prisma'
import { DEFAULT_ABOUT } from '@/lib/about-defaults'
import type { AboutContent } from '@/lib/about-defaults'
import AboutEditor from './AboutEditor'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getAbout(): Promise<AboutContent> {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: 'about' } })
    if (record) return JSON.parse(record.value) as AboutContent
  } catch {
    // Table not yet created — return defaults
  }
  return DEFAULT_ABOUT
}

export default async function AdminAboutPage() {
  const initial = await getAbout()

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
      <AboutEditor initial={initial} />
    </main>
  )
}
