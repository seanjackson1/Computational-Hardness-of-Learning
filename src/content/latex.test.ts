import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { inlineLabel, parseInline, type Inline } from './latex'
import { sections } from './sections'

function* formulas(nodes: Inline[]): Generator<string> {
  for (const node of nodes) {
    if (node.kind === 'math') yield node.value
    if ('children' in node) yield* formulas(node.children)
  }
}

describe('LaTeX article content', () => {
  it('loads all seven source documents with their original headings and references', () => {
    expect(sections).toHaveLength(7)
    for (const [index, page] of sections.entries()) {
      expect(page.title.startsWith(`Page ${index + 1}: `)).toBe(true)
      expect(page.blocks.some((block) => block.kind === 'bibliography' && block.entries.length > 0)).toBe(true)
    }
  })

  it('preserves content and punctuation around LaTeX markup', () => {
    expect(inlineLabel(parseInline(String.raw`Before \textit{the sample}, 10\% and $\epsilon$.`)))
      .toBe(String.raw`Before the sample, 10% and \epsilon.`)
  })

  it.each(sections)('renders all mathematics in $id', (page) => {
    for (const block of page.blocks) {
      if (block.kind === 'math') {
        expect(() => katex.renderToString(block.value, { displayMode: true, macros: { ...page.macros } })).not.toThrow()
        continue
      }
      const groups = block.kind === 'bibliography' ? block.entries.map((entry) => entry.children)
        : block.kind === 'list' ? block.items : [block.children]
      for (const group of groups) {
        for (const value of formulas(group)) {
          expect(() => katex.renderToString(value, { macros: { ...page.macros } })).not.toThrow()
        }
      }
    }
  })
})
