import { prisma } from '@/lib/prisma'
import { DEFAULT_ABOUT_PAGE } from '@/lib/about-page-defaults'
import type { AboutPageContent } from '@/lib/about-page-defaults'
import AboutPageEditor from './AboutPageEditor'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getAboutPage(): Promise<AboutPageContent> {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: 'about-page' } })
    if (record) return JSON.parse(record.value) as AboutPageContent
  } catch {
    // Table not yet created — return defaults
  }
  return DEFAULT_ABOUT_PAGE
}

export default async function AdminAboutPagePage() {
  const initial = await getAboutPage()

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
      <AboutPageEditor initial={initial} />
    </main>
  )
}
