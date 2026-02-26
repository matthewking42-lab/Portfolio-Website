import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border-b border-r border-gray-100">
      <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-gray-900 text-sm font-medium">{value || '—'}</div>
    </div>
  )
}

function SectorBadge({ sector }: { sector: string }) {
  let cls = 'badge-rail'
  if (sector.includes('Mining') || sector.includes('Industrial')) cls = 'badge-mining'
  else if (sector === 'Environment') cls = 'badge-environment'
  return (
    <span className={`font-mono text-xs px-3 py-1.5 ${cls}`}>{sector}</span>
  )
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } })

  if (!project || !project.published) notFound()

  const period = project.isOngoing
    ? `${project.startDate} – Present`
    : project.endDate
    ? `${project.startDate} – ${project.endDate}`
    : project.startDate

  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link
              href="/projects"
              className="font-mono text-xs text-gray-400 hover:text-accent transition-colors"
            >
              ← Projects
            </Link>
            {project.reference && (
              <>
                <span className="text-gray-300">/</span>
                <span className="font-mono text-xs text-gray-300">{project.reference}</span>
              </>
            )}
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="font-mono text-2xl md:text-3xl text-gray-900 font-light leading-snug max-w-2xl">
              {project.title}
            </h1>
            <SectorBadge sector={project.sector} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {/* Info grid */}
        <div className="border border-gray-100 mb-8 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Technical Details</span>
            {project.isOngoing && (
              <span className="font-mono text-xs px-2 py-0.5 bg-accent-light border border-accent-border text-accent">
                Ongoing
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <InfoField label="Client" value={project.client} />
            <InfoField label="Sector" value={project.sector} />
            <InfoField label="Location" value={project.location} />
            <InfoField label="Role" value={project.role} />
            {project.contract && <InfoField label="Contract" value={project.contract} />}
            <InfoField label="Period" value={period} />
            {project.reference && <InfoField label="Reference" value={project.reference} />}
            <InfoField
              label="Coordinates"
              value={`${project.latitude.toFixed(4)}, ${project.longitude.toFixed(4)}`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">
            Project Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-[15px] max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* PDF embed */}
        {project.pdfReport && (
          <div>
            <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">
              Report / Document
            </h2>
            <div className="border border-gray-100">
              <iframe
                src={`/uploads/${project.pdfReport}`}
                className="w-full"
                style={{ height: '70vh' }}
                title={`${project.title} report`}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
