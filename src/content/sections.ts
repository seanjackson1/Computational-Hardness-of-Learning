import { parseLatexPage } from './latex'

const sources = import.meta.glob<string>('../../PAGE_SOURCES/page*_mine.tex', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Keep the existing URL slugs. Titles and all article content come from LaTeX.
export const sections = [
  { id: 'introduction', shortTitle: 'Introduction' },
  { id: 'pac-learning', shortTitle: 'PAC Learning' },
  { id: 'sample-complexity', shortTitle: 'Sample Complexity' },
  { id: 'pseudorandom-functions', shortTitle: 'PRFs' },
  { id: 'prf-hardness', shortTitle: 'Main Theorem' },
  { id: 'interactive-demos', shortTitle: 'Demonstrations' },
  { id: 'implications', shortTitle: 'Further Reading' },
].map((section, index) => {
  const filename = `../../PAGE_SOURCES/page${index + 1}_mine.tex`
  const source = sources[filename]
  if (source === undefined) throw new Error(`Missing page source: ${filename}`)
  return { ...section, ...parseLatexPage(source), number: String(index + 1).padStart(2, '0') }
})

export type Section = typeof sections[number]

export function pageHref(page: string, anchor?: string) {
  return `#/${page}${anchor ? `/${anchor}` : ''}`
}
