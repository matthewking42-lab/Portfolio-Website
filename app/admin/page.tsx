import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminProjectRow from './AdminProjectRow'

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-medium text-gray-900">Matthew King</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <p className="text-gray-400 text-xs font-mono">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              ← Public Site
            </Link>
            <Link
              href="/admin/projects/new"
              className="btn-primary text-xs"
            >
              + Add Project
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="font-mono text-xs px-4 py-2 border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-all"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: projects.length, label: 'Total' },
            { value: projects.filter((p) => p.published).length, label: 'Published' },
            { value: projects.filter((p) => p.isOngoing).length, label: 'Ongoing' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white border border-gray-200 p-5">
              <div className="font-mono text-3xl text-accent font-light">{value}</div>
              <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Title', 'Sector', 'Location', 'Period', 'Published', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-widest font-normal ${i >= 4 ? 'text-center' : 'text-left'} ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <AdminProjectRow key={project.id} project={project} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
