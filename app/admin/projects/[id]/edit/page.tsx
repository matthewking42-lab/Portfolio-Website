import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProjectForm from '@/components/ProjectForm'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } })

  if (!project) notFound()

  const initial = {
    id: project.id,
    title: project.title,
    reference: project.reference ?? '',
    sector: project.sector,
    client: project.client,
    contract: project.contract ?? '',
    description: project.description,
    role: project.role,
    latitude: String(project.latitude),
    longitude: String(project.longitude),
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate ?? '',
    isOngoing: project.isOngoing,
    published: project.published,
    pdfReport: project.pdfReport,
    skills: project.skills,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin"
            className="font-mono text-xs text-gray-400 hover:text-accent transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="font-mono text-2xl text-gray-900 font-light mt-2">Edit Project</h1>
          <p className="text-gray-400 text-sm mt-1">{project.title}</p>
        </div>
        <ProjectForm mode="edit" initial={initial} />
      </div>
    </main>
  )
}
