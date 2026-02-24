export interface Initiative {
  number: string
  title: string
  tag: string
  description: string
  outcome: string
}

export type InitiativesContent = Initiative[]

export const DEFAULT_INITIATIVES: InitiativesContent = [
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
