export interface TimelineEntry {
  date: string
  role: string
  company: string
  description: string
}

export interface AboutContent {
  bioParagraphs: string[]
  skills: string[]
  timeline: TimelineEntry[]
}

export const DEFAULT_ABOUT: AboutContent = {
  bioParagraphs: [
    'I am a Civil and Structural Design Engineer specialising in railway bridge design and assessment. I work across a range of challenging infrastructure projects for Network Rail, from masonry arch reconstruction to steel deck bridge repair.',
    'My career began in March 2018 as a Trainee Engineer, gaining hands-on experience in bridge inspection, site survey, and structural assessment. I progressed to Assistant Engineer in October 2022, taking on lead designer roles for GRP stairways and bridge strengthening schemes, was promoted to Design Engineer in August 2023, and to Senior Design Engineer in April 2025.',
    'Currently, I am the designer for the reconstruction of Marle Pit Hill Bridge on the Midland Main Line Electrification scheme — a two-span masonry arch being replaced with a continuous integral concrete deck. I also lead structural design for surface-level infrastructure at ICL Boulby polyhalite mine in North Yorkshire.',
  ],
  skills: [
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
  ],
  timeline: [
    {
      date: 'Apr 2025 – Present',
      role: 'Senior Design Engineer',
      company: 'AmcoGiffen',
      description:
        'Promoted to Senior Design Engineer, taking increased responsibility for structural design delivery on Network Rail bridge and infrastructure projects.',
    },
    {
      date: 'Aug 2023 – Apr 2025',
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
  ],
}
