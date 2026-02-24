import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { DEFAULT_INITIATIVES } from '@/lib/initiatives-defaults'
import type { InitiativesContent } from '@/lib/initiatives-defaults'

export const dynamic = 'force-dynamic'

async function getInitiatives(): Promise<InitiativesContent> {
  try {
    const record = await prisma.siteContent.findUnique({ where: { key: 'initiatives' } })
    if (record) return JSON.parse(record.value) as InitiativesContent
  } catch {
    // DB not yet migrated or key not set — fall through to defaults
  }
  return DEFAULT_INITIATIVES
}

export default async function InitiativesPage() {
  const initiatives = await getInitiatives()

  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-accent" />
            <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">Beyond Engineering</span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-gray-900 font-light">Initiatives</h1>
          <p className="text-gray-500 text-base mt-4 max-w-xl leading-relaxed">
            Projects and programmes I have led outside of client engineering work —
            improving how the team operates, building new capabilities, and introducing
            new technology.
          </p>
        </div>
      </div>

      {/* Initiatives list */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="space-y-0 divide-y divide-gray-100">
          {initiatives.map((item, idx) => (
            <div key={idx} className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">

              {/* Number + tag */}
              <div className="md:col-span-3">
                <div className="font-mono text-5xl font-light text-gray-100 mb-3 leading-none">
                  {item.number}
                </div>
                <span className="inline-block font-mono text-[10px] px-2 py-1 border border-accent-border bg-accent-light text-accent tracking-widest uppercase">
                  {item.tag}
                </span>
              </div>

              {/* Content */}
              <div className="md:col-span-9">
                <h2 className="font-mono text-xl font-medium text-gray-900 mb-4 leading-snug">
                  {item.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="block w-4 h-px bg-accent" />
                  <span className="font-mono text-xs text-accent tracking-wide">
                    {item.outcome}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100 flex gap-3 flex-wrap">
          <Link href="/projects" className="btn-primary">
            View Projects Map →
          </Link>
          <Link href="/career" className="btn-secondary">
            Career →
          </Link>
        </div>
      </div>
    </main>
  )
}
