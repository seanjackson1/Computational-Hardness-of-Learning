export type SectionMeta = {
  id: string
  number: string
  shortTitle: string
  title: string
  description: string
}

export const sections: SectionMeta[] = [
  {
    id: 'introduction',
    number: '01',
    shortTitle: 'Introduction',
    title: 'Introduction & Motivation',
    description: 'This page will introduce the project and its central distinction between the amount of data needed for learning and the computation needed to learn efficiently.',
  },
  {
    id: 'pac-learning',
    number: '02',
    shortTitle: 'PAC Learning',
    title: 'Foundations of PAC Learning',
    description: 'This page will define the PAC learning framework and introduce the notation used throughout the project.',
  },
  {
    id: 'sample-complexity',
    number: '03',
    shortTitle: 'Sample Complexity',
    title: 'Sample Complexity vs. Computational Complexity',
    description: 'This page will outline the finite-class sample bound and contrast sample complexity with computational complexity.',
  },
  {
    id: 'pseudorandom-functions',
    number: '04',
    shortTitle: 'PRFs',
    title: 'Pseudorandom Functions',
    description: 'This page will define pseudorandom functions and introduce the oracle distinguishing experiment.',
  },
  {
    id: 'prf-hardness',
    number: '05',
    shortTitle: 'Main Theorem',
    title: 'Main Theorem: Hardness of Learning PRFs',
    description: 'This page will state the conditional hardness theorem and organize the reduction from an efficient learner to a PRF distinguisher.',
  },
  {
    id: 'interactive-demos',
    number: '06',
    shortTitle: 'Demonstrations',
    title: 'Interactive Demonstrations',
    description: 'This page will eventually contain the project’s browser-based learning and pseudorandom-function demonstrations.',
  },
  {
    id: 'implications',
    number: '07',
    shortTitle: 'Further Reading',
    title: 'Implications & Further Reading',
    description: 'This page will collect the project’s implications, limitations, references, and suggestions for further reading.',
  },
]
