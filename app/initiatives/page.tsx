import Link from 'next/link'

const initiatives = [
  {
    number: '01',
    title: 'Design Team Project Database',
    tag: 'Efficiency & Knowledge',
    description:
      'Identified a recurring problem in the design team: engineers spent significant time searching for past projects to use as precedents, often duplicating work that had already been done. I designed and built a searchable internal database of completed projects, capturing key project data, design approaches, and lessons learned. This has allowed the team to quickly locate relevant past work, reducing time spent on research and improving consistency across design submissions.',
    outcome: 'Adopted across the design team — reducing duplicated research effort.',
  },
  {
    number: '02',
    title: 'Surveying Team Business Plan',
    tag: 'Strategy & Business Development',
    description:
      'Developed a full business plan for the establishment of an in-house surveying capability within the organisation. The plan covered market opportunity, required resources, financial projections, and an implementation roadmap. The proposal was reviewed at a senior level and subsequently implemented, resulting in the creation of a dedicated surveying function that has since delivered measurable value to the business.',
    outcome: 'Reviewed at senior level and implemented by the business.',
  },
  {
    number: '03',
    title: 'AI Deployment Programme',
    tag: 'Innovation & Technology',
    description:
      'Led the adoption of AI tools across the business to improve efficiency in engineering and administrative tasks. This involved evaluating available tools, developing practical workflows for tasks such as report drafting, document summarisation, and code assistance, and delivering guidance to colleagues on responsible use. The programme aimed to reduce time spent on repetitive tasks and free engineers to focus on higher-value design work.',
    outcome: 'Delivered AI workflows and guidance across the engineering team.',
  },
]

export default function InitiativesPage() {
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
          {initiatives.map((item) => (
            <div key={item.number} className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">

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
