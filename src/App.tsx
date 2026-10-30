import { useEffect, useMemo, useState } from 'react'
import { sections } from './content/sections'

function pageFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return sections.findIndex((section) => section.id === id)
}

function App() {
  const [pageIndex, setPageIndex] = useState(() => {
    const index = pageFromHash()
    return index >= 0 ? index : 0
  })

  useEffect(() => {
    const updatePage = () => {
      const index = pageFromHash()
      if (index >= 0) setPageIndex(index)
    }
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
    document.title = `${sections[pageIndex].title} | Computational Hardness of Learning`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pageIndex])

  const page = useMemo(() => sections[pageIndex], [pageIndex])
  const previous = pageIndex > 0 ? sections[pageIndex - 1] : null
  const next = pageIndex < sections.length - 1 ? sections[pageIndex + 1] : null

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-name" href="#/introduction">
          <strong>Computational Hardness of Learning</strong>
          <span>CS455 · Fall 2026</span>
        </a>

        <nav aria-label="Pages">
          {sections.map((section, index) => (
            <a
              key={section.id}
              className={index === pageIndex ? 'active' : ''}
              href={`#/${section.id}`}
              aria-current={index === pageIndex ? 'page' : undefined}
            >
              <span>{section.number}</span>
              {section.shortTitle}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article className="page-card">
          <p className="page-number">Page {page.number} of 07</p>
          <h1>{page.title}</h1>
          <p className="page-description">{page.description}</p>

          <div className="empty-state">
            <span>To Be Filled In</span>
          </div>

          <nav className="page-navigation" aria-label="Previous and next pages">
            <div>
              {previous && <a href={`#/${previous.id}`}>← {previous.shortTitle}</a>}
            </div>
            <div>
              {next && <a href={`#/${next.id}`}>{next.shortTitle} →</a>}
            </div>
          </nav>
        </article>
      </main>

      <footer>
        <span>CS455 Project Outline</span>
        <span>Seven pages · Content pending</span>
      </footer>
    </div>
  )
}

export default App
