import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-accent" />
            <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">Personal</span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-gray-900 font-light">About</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — intro */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent-light border border-accent-border flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-accent font-medium text-lg">MK</span>
              </div>
              <div>
                <div className="font-mono text-gray-900 font-medium">Matthew King</div>
                <div className="text-gray-500 text-sm">Senior Civil &amp; Structural Design Engineer</div>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <p>
                I am a Senior Civil and Structural Design Engineer based in the UK, specialising
                in railway bridge infrastructure. Outside of engineering, I am driven by a broader
                interest in how organisations work — how teams collaborate, how processes can be
                improved, and how technology can be applied to real-world problems.
              </p>
              <p>
                This curiosity has led me to take on projects beyond my core engineering role —
                from building internal tools that improve team efficiency, to developing business
                plans and leading the adoption of new technology across the organisation.
              </p>
              <p>
                I am always looking for ways to contribute beyond the job description, whether
                that is through mentoring junior colleagues, improving how the team manages
                knowledge, or exploring how emerging tools like AI can be applied responsibly
                in a professional engineering context.
              </p>
            </div>

            {/* LinkedIn */}
            <div className="pt-6 border-t border-gray-100">
              <a
                href="https://www.linkedin.com/in/matthew-king-88b395161/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group"
              >
                <div className="w-9 h-9 border border-gray-200 group-hover:border-accent-border group-hover:bg-accent-light flex items-center justify-center transition-all">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-accent transition-colors">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-accent font-medium transition-colors">
                  Connect on LinkedIn
                </span>
              </a>
            </div>
          </div>

          {/* Right — quick facts */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-5">
                At a Glance
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Based in', value: 'United Kingdom' },
                  { label: 'Employer', value: 'AmcoGiffen' },
                  { label: 'Specialisation', value: 'Railway Bridge Design' },
                  { label: 'Chartered status', value: 'Working towards CEng' },
                  { label: 'Career start', value: 'March 2018' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between border-b border-gray-50 pb-3">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">{label}</span>
                    <span className="font-mono text-xs text-gray-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-5">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Structural Engineering',
                  'Process Improvement',
                  'AI & Technology',
                  'Business Development',
                  'Mentoring',
                  'Surveying',
                  'Laser Scanning',
                ].map((interest) => (
                  <span
                    key={interest}
                    className="font-mono text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:border-accent-border hover:bg-accent-light hover:text-accent transition-all cursor-default"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex gap-3 flex-wrap">
          <Link href="/career" className="btn-primary">
            View Career →
          </Link>
          <Link href="/initiatives" className="btn-secondary">
            Initiatives →
          </Link>
        </div>
      </div>
    </main>
  )
}
