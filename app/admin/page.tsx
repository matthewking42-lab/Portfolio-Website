import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminImportButton from "./AdminImportButton";
import AdminProjectList from "./AdminProjectList";

// Force dynamic rendering to avoid build-time DB queries (required for Netlify deploy)
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      sector: true,
      location: true,
      startDate: true,
      endDate: true,
      isOngoing: true,
      published: true,
      pinned: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-medium text-gray-900">
                Matthew King
              </span>
            </div>
            <p className="text-gray-400 text-xs font-mono">Admin Dashboard</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Primary actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="font-mono text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                ← Public Site
              </Link>
              <AdminImportButton />
              <Link href="/admin/projects/new" className="btn-primary text-xs">
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
            {/* Page editors */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest">Edit pages:</span>
              <Link
                href="/admin/about-page"
                className="font-mono text-xs px-3 py-1 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
              >
                About
              </Link>
              <Link
                href="/admin/about"
                className="font-mono text-xs px-3 py-1 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
              >
                Career
              </Link>
              <Link
                href="/admin/initiatives"
                className="font-mono text-xs px-3 py-1 border border-gray-200 text-gray-500 hover:border-accent hover:text-accent transition-all"
              >
                Initiatives
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { value: projects.length, label: "Total", sub: "" },
            { value: projects.filter((p) => p.published).length, label: "Published", sub: "" },
            { value: projects.filter((p) => p.isOngoing).length, label: "Ongoing", sub: "" },
            { value: projects.filter((p) => p.pinned).length, label: "Pinned", sub: "Hero map tour" },
          ].map(({ value, label, sub }) => (
            <div key={label} className="bg-white border border-gray-200 p-5">
              <div className="font-mono text-3xl text-accent font-light">{value}</div>
              <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mt-1">
                {label}
              </div>
              {sub && <div className="font-mono text-[10px] text-gray-300 mt-0.5">{sub}</div>}
            </div>
          ))}
        </div>

        {/* Project list with search */}
        <AdminProjectList projects={projects} />
      </div>
    </main>
  );
}
