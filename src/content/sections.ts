export type SectionMeta = {
  id: string
  number: string
  shortTitle: string
  title: string
}

export const sections: SectionMeta[] = [
  { id: 'introduction', number: '01', shortTitle: 'Introduction', title: 'Introduction & Motivation' },
  { id: 'pac-learning', number: '02', shortTitle: 'PAC Learning', title: 'Foundations of PAC Learning' },
  { id: 'sample-complexity', number: '03', shortTitle: 'Sample vs. Compute', title: 'Sample Complexity vs. Computational Complexity' },
  { id: 'pseudorandom-functions', number: '04', shortTitle: 'PRFs', title: 'Pseudorandom Functions' },
  { id: 'prf-hardness', number: '05', shortTitle: 'Main Theorem', title: 'Main Theorem: Hardness of Learning PRFs' },
  { id: 'interactive-demos', number: '06', shortTitle: 'Demos', title: 'Interactive Demonstrations' },
  { id: 'implications', number: '07', shortTitle: 'Further Reading', title: 'Implications & Further Reading' },
]

export const authorSlots = {
  introduction: '',
  pacDefinition: '',
  pacExample: '',
  sampleInterpretation: '',
  prfDefinition: '',
  theoremStatement: '',
  implications: '',
  caveats: '',
  currentResearch: '',
}
