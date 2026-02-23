import Link from 'next/link'

const skills = [
  'Structural Analysis',
  'Bridge Design',
  'Masonry Arch Structures',
  'Steel Bridge Design',
  'Concrete Deck Design',
  'GRP Structures',
  'Cast Iron Assessment',
  'Foundation Design',
  '3D Frame Analysis',
  'Load Derivation',
  'Site Inspection',
  'Laser Scanning',
  'Optioneering',
  'Client Engagement',
  'Network Rail Standards',
  'Eurocodes',
  'AutoCAD',
]

const timeline = [
  {
    date: 'Aug 2023 – Present',
    role: 'Design Engineer',
    company: 'AmcoGiffen',
    description:
      'Leading structural design on Network Rail bridge reconstruction projects as part of the Midland Main Line Electrification scheme. Also designing surface infrastructure for underground laboratories at ICL Boulby mine.',
  },
  {
    date: 'Oct 2022 – Aug 2023',
    role: 'Assistant Engineer',
    company: 'AmcoGiffen',
    description:
      'Led design of bridge decks, temporary works, and GRP stair structures. Managed design packages from conceptual optioneering through to detailed design and site support.',
  },
  {
    date: 'Mar 2018 – Oct 2022',
    role: 'Trainee Engineer',
    company: 'AmcoGiffen',
    description:
      'Gained broad experience across railway bridge assessment and repair: cast iron girder strengthening, steel trough deck propping, site inspection, and laser scanning.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-accent" />
            <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">Profile</span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-gray-900 font-light">About</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — bio */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-accent-light border border-accent-border flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-accent font-medium text-lg">MK</span>
              </div>
              <div>
                <div className="font-mono text-gray-900 font-medium">Matthew King</div>
                <div className="text-gray-500 text-sm">Civil &amp; Structural Design Engineer</div>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <p>
                I am a Civil and Structural Design Engineer specialising in railway bridge
                design and assessment. I work across a range of challenging infrastructure
                projects for Network Rail, from masonry arch reconstruction to steel deck
                bridge repair.
              </p>
              <p>
                My career began in March 2018 as a Trainee Engineer, gaining hands-on
                experience in bridge inspection, site survey, and structural assessment. I
                progressed to Assistant Engineer in October 2022, taking on lead designer
                roles for GRP stairways and bridge strengthening schemes, and was promoted
                to Design Engineer in August 2023.
              </p>
              <p>
                Currently, I am the designer for the reconstruction of Marle Pit Hill Bridge
                on the Midland Main Line Electrification scheme — a two-span masonry arch
                being replaced with a continuous integral concrete deck. I also lead
                structural design for surface-level infrastructure at ICL Boulby polyhalite
                mine in North Yorkshire.
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

          {/* Right — skills + timeline */}
          <div className="lg:col-span-2 space-y-10">
            {/* Skills */}
            <div>
              <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:border-accent-border hover:bg-accent-light hover:text-accent transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Career timeline */}
            <div>
              <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-6">
                Career
              </h2>
              {timeline.map((item, i) => (
                <div key={item.date} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0 mt-1.5 ring-4 ring-green-50" />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="font-mono text-[11px] text-accent tracking-wide uppercase mb-0.5">
                      {item.date}
                    </div>
                    <div className="font-mono text-gray-900 text-sm font-medium">{item.role}</div>
                    <div className="text-gray-400 text-xs mb-2">{item.company}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <Link href="/projects" className="btn-primary">
            View Projects Map →
          </Link>
        </div>
      </div>
    </main>
  )
}
