import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArticleContent } from './components/ArticleContent'
import { inlineLabel } from './content/latex'
import { pageHref, sections, type Section } from './content/sections'
import { ParityLearner } from './demos/ParityLearner'
import { PrfChallenge } from './demos/PrfChallenge'
import { SampleBoundCalculator } from './demos/SampleBoundCalculator'

const siteTitle = 'Computational Hardness of Learning: PAC Learning and Pseudorandom Functions'

function readLocation() {
  const [id, anchor] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { index: Math.max(0, sections.findIndex((page) => page.id === id)), anchor }
}

const demoPlacements = [
  { heading: 'sample-bound-calculator', id: 'sample-bound', Component: SampleBoundCalculator },
  { heading: 'oracle-challenge', id: 'oracle', Component: PrfChallenge },
  { heading: 'a-family-we-can-learn-efficiently', id: 'parity', Component: ParityLearner, afterEquation: true },
] as const

function placeDemos(page: Section) {
  if (page.id !== 'interactive-demos') return undefined

  const placements = new Map<number, ReactNode>()
  for (const demo of demoPlacements) {
    const start = page.blocks.findIndex((block) => block.kind === 'heading' && block.id === demo.heading)
    if (start < 0) continue
    const nextHeading = page.blocks.findIndex((block, index) => index > start && (
      (block.kind === 'heading' && block.level === 2) || block.kind === 'bibliography'
    ))
    const end = nextHeading < 0 ? page.blocks.length : nextHeading
    const equation = 'afterEquation' in demo
      ? page.blocks.findIndex((block, index) => index > start && index < end && block.kind === 'math')
      : -1
    const index = equation < 0 ? end - 1 : equation
    const { Component, id } = demo
    placements.set(index, <section id={id} tabIndex={-1}><Component /></section>)
  }
  return placements
}

function pageContents(page: Section) {
  const links = page.blocks.flatMap((block) => {
    if (block.kind !== 'heading') return []
    const label = inlineLabel(block.children)
    if (block.level > 2 && !/^Step \d|^Polynomial Time|^Correctness|^Advantage|^Conclusion/.test(label)) return []
    return [{ id: block.id, label, inset: block.level > 2 }]
  })
  if (page.id === 'sample-complexity') links.push({ id: 'sample-bound', label: 'Finite-class sample bound calculator', inset: false })
  if (page.blocks.some((block) => block.kind === 'bibliography')) links.push({ id: 'references', label: 'References', inset: false })
  return links
}

function Contents({ page, anchor }: { page: Section; anchor?: string }) {
  return <nav aria-label="On this page">
    <ul>{pageContents(page).map((link) => (
      <li className={link.inset ? 'nested' : undefined} key={link.id}>
        <a href={pageHref(page.id, link.id)} aria-current={anchor === link.id ? 'location' : undefined}>{link.label}</a>
      </li>
    ))}</ul>
  </nav>
}

function App() {
  const [location, setLocation] = useState(readLocation)
  const chapterNavigation = useRef<HTMLElement>(null)
  const { index, anchor } = location
  const page = sections[index]
  const previous = sections[index - 1]
  const next = sections[index + 1]

  useEffect(() => {
    const onHashChange = () => setLocation(readLocation())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const navigation = chapterNavigation.current
    if (!navigation) return

    const revealCurrentPage = () => {
      const current = navigation.querySelector('[aria-current="page"]')
      if (!current || navigation.scrollWidth <= navigation.clientWidth) return
      const visible = navigation.getBoundingClientRect()
      const link = current.getBoundingClientRect()
      if (link.right > visible.right) navigation.scrollLeft += link.right - visible.right
      if (link.left < visible.left) navigation.scrollLeft += link.left - visible.left
    }

    revealCurrentPage()
    const observer = new ResizeObserver(revealCurrentPage)
    observer.observe(navigation)
    return () => observer.disconnect()
  }, [index])

  useEffect(() => {
    document.title = `${page.title} | ${siteTitle}`
    if (anchor) {
      const target = document.getElementById(anchor)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [page, anchor])

  const sampleBound = page.id === 'sample-complexity'
    ? <section id="sample-bound" tabIndex={-1}><SampleBoundCalculator compact /></section>
    : undefined

  return (
    <div className="site-shell">
      <a className="skip-link" href={pageHref(page.id, 'page-title')}>Skip to content</a>
      <header className="site-header">
        <a className="site-name" href={pageHref('introduction')}>
          <strong>{siteTitle}</strong>
          <span>CS455 · Fall 2026</span>
        </a>
        <nav className="chapter-navigation" aria-label="Pages" ref={chapterNavigation}>
          {sections.map((chapter, chapterIndex) => <a key={chapter.id} href={pageHref(chapter.id)} aria-current={chapterIndex === index ? 'page' : undefined}>
            <span>{chapter.number}</span>{chapter.shortTitle}
          </a>)}
        </nav>
      </header>

      <main className="reader-layout">
        <aside className="reader-rail">
          <p className="rail-title">On this page</p>
          <Contents page={page} anchor={anchor} />
        </aside>
        <article className="page-card" key={page.id}>
          <h1 id="page-title" tabIndex={-1}>{page.title}</h1>
          <details className="mobile-contents" key={page.id}>
            <summary>On this page</summary>
            <Contents page={page} anchor={anchor} />
          </details>
          <ArticleContent page={page} afterBlock={placeDemos(page)} beforeReferences={sampleBound} beforeHeading={page.id === 'pseudorandom-functions' ? {
            'negligible-advantage': <a className="related-link" href={pageHref('interactive-demos', 'oracle')}>Open the oracle challenge</a>,
          } : undefined} />
          <nav className="page-navigation" aria-label="Previous and next pages">
            {previous && <a href={pageHref(previous.id)}><small>Previous</small>{previous.shortTitle}</a>}
            {next && <a href={pageHref(next.id)} rel="next"><small>Next</small>{next.shortTitle}</a>}
          </nav>
        </article>
      </main>

      <footer>
        <span>CS455 · Fall 2026</span>
        <a href={pageHref(page.id, 'page-title')}>Back to top</a>
      </footer>
    </div>
  )
}

export default App
