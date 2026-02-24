'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/career', label: 'Career' },
  { href: '/contact', label: 'Contact' },
]

const projectsLinks = [
  { href: '/projects', label: 'Project Map' },
  { href: '/initiatives', label: 'Initiatives' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname.startsWith('/admin')) return null

  const isProjectsActive =
    pathname.startsWith('/projects') || pathname.startsWith('/initiatives')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm font-medium text-gray-900 tracking-tight"
        >
          Matthew King
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-widest transition-colors duration-150 ${
                pathname === link.href
                  ? 'text-accent'
                  : 'text-gray-400 hover:text-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Projects dropdown */}
          <div className="relative group/projects">
            <button
              className={`font-mono text-xs uppercase tracking-widest transition-colors duration-150 flex items-center gap-1 ${
                isProjectsActive
                  ? 'text-accent'
                  : 'text-gray-400 group-hover/projects:text-gray-800'
              }`}
            >
              Projects
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="currentColor"
                className="mt-px opacity-60 transition-transform duration-150 group-hover/projects:translate-y-px"
              >
                <path d="M0 0L4 5L8 0H0Z" />
              </svg>
            </button>

            {/* Dropdown panel — connected to trigger via pt-2 so hover doesn't break */}
            <div className="absolute top-full right-0 pt-2 opacity-0 invisible pointer-events-none group-hover/projects:opacity-100 group-hover/projects:visible group-hover/projects:pointer-events-auto transition-all duration-150 min-w-[160px]">
              <div className="bg-white border border-gray-200 shadow-lg py-1">
                {projectsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                      pathname === link.href || pathname.startsWith(link.href + '/')
                        ? 'text-accent bg-green-50'
                        : 'text-gray-500 hover:text-accent hover:bg-green-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-400 hover:text-gray-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white py-3 px-6 flex flex-col gap-4">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-mono text-xs uppercase tracking-widest ${
                pathname === link.href ? 'text-accent' : 'text-gray-500'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Projects sub-section */}
          <div className="border-l-2 border-gray-100 pl-3 flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-300">
              Projects
            </span>
            {projectsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-mono text-xs uppercase tracking-widest ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-accent'
                    : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
