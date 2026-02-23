import Link from 'next/link'
import ProjectForm from '@/components/ProjectForm'

export default function NewProjectPage() {
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
          <h1 className="font-mono text-2xl text-gray-900 font-light mt-2">New Project</h1>
        </div>
        <ProjectForm mode="new" />
      </div>
    </main>
  )
}
