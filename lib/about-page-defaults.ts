export interface AboutFact {
  label: string
  value: string
}

export interface AboutPageContent {
  bioParagraphs: string[]
  facts: AboutFact[]
  interests: string[]
}

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  bioParagraphs: [
    'I am a Senior Civil and Structural Design Engineer based in the UK, specialising in railway bridge infrastructure. Outside of engineering, I am driven by a broader interest in how organisations work — how teams collaborate, how processes can be improved, and how technology can be applied to real-world problems.',
    'This curiosity has led me to take on projects beyond my core engineering role — from building internal tools that improve team efficiency, to developing business plans and leading the adoption of new technology across the organisation.',
    'I am always looking for ways to contribute beyond the job description, whether that is through mentoring junior colleagues, improving how the team manages knowledge, or exploring how emerging tools like AI can be applied responsibly in a professional engineering context.',
  ],
  facts: [
    { label: 'Based in', value: 'United Kingdom' },
    { label: 'Employer', value: 'AmcoGiffen' },
    { label: 'Specialisation', value: 'Railway Bridge Design' },
    { label: 'Chartered status', value: 'Working towards CEng' },
    { label: 'Career start', value: 'March 2018' },
  ],
  interests: [
    'Structural Engineering',
    'Process Improvement',
    'AI & Technology',
    'Business Development',
    'Mentoring',
    'Surveying',
    'Laser Scanning',
  ],
}
