import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-accent" />
            <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">Get in Touch</span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-gray-900 font-light">Contact</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="max-w-lg space-y-6">
          <p className="text-gray-500 text-[15px] leading-relaxed">
            For project enquiries or professional opportunities, LinkedIn is the best way to reach me.
          </p>

          {/* LinkedIn card */}
          <a
            href="https://www.linkedin.com/in/matthew-king-88b395161/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 border border-gray-200 hover:border-accent-border hover:bg-accent-light transition-all group"
          >
            <div className="w-10 h-10 bg-gray-50 group-hover:bg-white border border-gray-200 group-hover:border-accent-border flex items-center justify-center flex-shrink-0 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-accent transition-colors">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 group-hover:text-accent transition-colors text-sm">
                LinkedIn
              </div>
              <div className="text-gray-400 text-xs font-mono mt-0.5">
                matthew-king-88b395161
              </div>
            </div>
            <svg
              className="ml-auto text-gray-300 group-hover:text-accent transition-colors"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 border border-gray-100 bg-gray-50">
              <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Based</div>
              <div className="text-gray-700 text-sm">United Kingdom</div>
            </div>
            <div className="p-5 border border-gray-100 bg-gray-50">
              <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Employer</div>
              <div className="text-gray-700 text-sm">AmcoGiffen</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
