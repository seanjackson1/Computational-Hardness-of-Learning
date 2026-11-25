import { Fragment, useState } from 'react'
import type { ReactNode } from 'react'
import type { Inline } from '../content/latex'
import { pageHref, type Section } from '../content/sections'
import { MathBlock, MathInline } from './MathText'

function ProofSteps({ items, render }: { items: Inline[][]; render: (nodes: Inline[]) => ReactNode }) {
  const [active, setActive] = useState(0)

  return (
    <div className="proof-steps" id="reduction-steps" tabIndex={-1}>
      <ol>
        {items.map((item, index) => (
          <li key={index} aria-current={index === active ? 'step' : undefined}>{render(item)}</li>
        ))}
      </ol>
      <div className="proof-controls" aria-label="Proof steps">
        <button type="button" className="ghost" disabled={active === 0} onClick={() => setActive(active - 1)}>Previous step</button>
        <span role="status">Step {active + 1} of {items.length}</span>
        <button type="button" className="ghost" disabled={active === items.length - 1} onClick={() => setActive(active + 1)}>Next step</button>
      </div>
    </div>
  )
}

export function ArticleContent({ page, beforeReferences, beforeHeading, afterBlock }: {
  page: Section
  beforeReferences?: ReactNode
  beforeHeading?: Record<string, ReactNode>
  afterBlock?: ReadonlyMap<number, ReactNode>
}) {
  const bibliography = page.blocks.find((block) => block.kind === 'bibliography')
  const entries = bibliography?.entries ?? []

  function renderInline(nodes: Inline[]): ReactNode {
    return nodes.map((node, index) => {
      switch (node.kind) {
        case 'text': return node.value
        case 'math': return <MathInline key={index} macros={page.macros}>{node.value}</MathInline>
        case 'emphasis': return <em key={index}>{renderInline(node.children)}</em>
        case 'strong': return <strong key={index}>{renderInline(node.children)}</strong>
        case 'code': return <code key={index}>{renderInline(node.children)}</code>
        case 'link': return <a key={index} href={node.href}>{renderInline(node.children)}</a>
        case 'citation': return <span className="citation" key={index}>[{node.value.split(',').map((key, position) => {
          const ref = key.trim()
          const number = entries.findIndex((entry) => entry.key === ref) + 1
          return <Fragment key={position}>{position > 0 ? ', ' : ''}<a href={pageHref(page.id, `ref-${ref}`)}>{number || ref}</a></Fragment>
        })}]</span>
      }
    })
  }

  function renderBlock(block: Section['blocks'][number]) {
    switch (block.kind) {
      case 'heading': {
        const Heading = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4'
        return <>
          {beforeHeading?.[block.id]}
          <Heading id={block.id} tabIndex={-1}>{renderInline(block.children)}</Heading>
        </>
      }
      case 'paragraph': return <p>{renderInline(block.children)}</p>
      case 'math': return <MathBlock macros={page.macros}>{block.value}</MathBlock>
      case 'list': {
        if (page.id === 'prf-hardness' && block.ordered) {
          return <ProofSteps items={block.items} render={renderInline} />
        }
        const List = block.ordered ? 'ol' : 'ul'
        return <List>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</List>
      }
      case 'bibliography': return <>
        {beforeReferences}
        <section className="references" aria-labelledby="references">
          <h2 id="references" tabIndex={-1}>References</h2>
          <ol>{block.entries.map((entry) => <li id={`ref-${entry.key}`} tabIndex={-1} key={entry.key}>{renderInline(entry.children)}</li>)}</ol>
        </section>
      </>
    }
  }

  return (
    <div className="article-content">
      {page.blocks.map((block, index) => (
        <Fragment key={index}>{renderBlock(block)}{afterBlock?.get(index)}</Fragment>
      ))}
      {!bibliography && beforeReferences}
    </div>
  )
}
