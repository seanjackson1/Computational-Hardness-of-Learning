import { useEffect, useState } from 'react'
import { MathBlock, MathInline } from './components/MathText'
import { AuthorPlaceholder, Card, Section, Stepper } from './components/Primitives'
import { sections } from './content/sections'
import { sources } from './data/sources'
import { ParityLearner } from './demos/ParityLearner'
import { PrfChallenge } from './demos/PrfChallenge'
import { SampleBoundCalculator } from './demos/SampleBoundCalculator'

function TableOfContents({ active }: { active: string }) {
  return (
    <aside className="toc" aria-label="Table of contents">
      <a className="toc-brand" href="#top" aria-label="Back to top"><span>CHL</span><small>CS455 · 2026</small></a>
      <nav>{sections.map((section) => <a key={section.id} className={active === section.id ? 'active' : ''} href={`#${section.id}`}><span>{section.number}</span>{section.shortTitle}</a>)}</nav>
      <a className="toc-reference" href="#implications">References ↗</a>
    </aside>
  )
}

function MobileNav({ active }: { active: string }) {
  return (
    <header className="mobile-header"><a href="#top">CHL <small>CS455</small></a><label><span className="sr-only">Jump to section</span><select value={active} onChange={(event) => { location.hash = event.target.value }}><option value="top">Contents</option>{sections.map((section) => <option key={section.id} value={section.id}>{section.number} · {section.shortTitle}</option>)}</select></label></header>
  )
}

function FlowDiagram() {
  return (
    <div className="flow-diagram" aria-label="Training examples enter a learner, which produces a hypothesis used on a fresh input">
      <div><span className="node-label">Training data</span><MathInline>{'(x_i, f(x_i))'}</MathInline></div><span className="arrow">→</span><div className="learner-node"><span className="node-label">Algorithm</span><strong>Learner</strong></div><span className="arrow">→</span><div><span className="node-label">Output</span><MathInline>{'h'}</MathInline></div><span className="arrow">→</span><div><span className="node-label">Fresh input</span><MathInline>{'h(x)'}</MathInline></div>
    </div>
  )
}

function App() {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.6] })
    sections.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [])

  return (
    <div id="top">
      <TableOfContents active={active} /><MobileNav active={active} />
      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-meta"><span>CS455 · Complexity Theory</span><span>Educational prototype · Fall 2026</span></div>
          <p className="eyebrow">Interactive course outline</p>
          <h1 id="page-title">The Computational<br />Hardness of <em>Learning</em></h1>
          <AuthorPlaceholder note="Write the opening motivation here: learning black-box functions, the role of data, and the role of computation." />
          <div className="hero-actions"><a className="button" href="#introduction">Start learning ↓</a><a className="text-link" href="#interactive-demos">Open demonstrations</a></div>
          <div className="binary-field" aria-hidden="true">01101001 · 10110100 · 00101110 · 11001001</div>
        </section>

        <Section id="introduction" number="01" title="Introduction & Motivation" kicker="Learning as a computational problem">
          <AuthorPlaceholder note="Introduce the learning problem, the black-box viewpoint, and the connection to cryptography in your own words." />
          <FlowDiagram />
          <div className="split-grid"><Card><span className="eyebrow">Resource 01</span><h3>Sample complexity</h3><AuthorPlaceholder note="Explain what it means to have enough observations." /></Card><Card><span className="eyebrow">Resource 02</span><h3>Running time</h3><AuthorPlaceholder note="Explain what it means to find a hypothesis efficiently." /></Card></div>
          <Card className="roadmap"><div className="card-heading"><span className="eyebrow">Roadmap</span><h3>Seven stops, one central distinction</h3></div><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}><span>{section.number}</span>{section.title}</a></li>)}</ol></Card>
        </Section>

        <Section id="pac-learning" number="02" title="Foundations of PAC Learning" kicker="Definitions & notation">
          <div className="notation-strip">{['\\mathcal H', 'D', '\\epsilon', '\\delta', 'h', 'f'].map((symbol) => <span key={symbol}><MathInline>{symbol}</MathInline></span>)}</div>
          <div className="split-grid">
            <Card className="formula-card"><span className="eyebrow">Target error</span><MathBlock>{'\\Pr_{x\\sim D}[h(x)\\ne f(x)]\\le\\epsilon'}</MathBlock></Card>
            <Card className="formula-card"><span className="eyebrow">Success probability</span><MathBlock>{'\\Pr[\\operatorname{err}_D(h)\\le\\epsilon]\\ge 1-\\delta'}</MathBlock></Card>
          </div>
          <AuthorPlaceholder note="Define the realizable PAC model, identify every probability space, and distinguish realizable from agnostic learning." />
          <Card className="train-test"><div><span className="eyebrow">Observed</span><h3>Training sample</h3><code>(x₁, y₁) ··· (xₘ, yₘ)</code></div><span>≠</span><div><span className="eyebrow">Unseen</span><h3>Fresh input</h3><code>x ∼ D</code></div></Card>
          <AuthorPlaceholder label="Author example pending" note="Add one short original example that uses the notation above." />
        </Section>

        <Section id="sample-complexity" number="03" title="Sample Complexity vs. Computational Complexity" kicker="Finite hypothesis classes">
          <Card className="theorem-card"><span className="theorem-label">Finite hypothesis class sample bound</span><h3>Sufficient realizable bound</h3><MathBlock>{'m\\ge\\frac{\\ln|\\mathcal H|+\\ln(1/\\delta)}{\\epsilon}'}</MathBlock><p className="verification-note">Formal expression to be verified by the author: assumptions and ceiling convention.</p></Card>
          <Stepper title="Four proof obligations" steps={[
            { label: 'Set up bad hypotheses' },
            { label: 'Bound consistency for a fixed bad hypothesis', formula: <MathBlock>{'(1-\\epsilon)^m\\le e^{-\\epsilon m}'}</MathBlock> },
            { label: 'Apply the union bound', formula: <MathBlock>{'|\\mathcal H|e^{-\\epsilon m}'}</MathBlock> },
            { label: 'Solve for the sample size' },
          ]} />
          <SampleBoundCalculator compact />
          <div className="contrast"><div><strong>Samples</strong><span>Finite-class sufficient bound</span></div><span>≠</span><div><strong>Search</strong><span>Potentially expensive consistency problem</span></div></div>
          <AuthorPlaceholder note="Interpret the calculator and the distinction above without claiming this bound is necessary for every class." />
        </Section>

        <Section id="pseudorandom-functions" number="04" title="Pseudorandom Functions" kicker="A cryptographic family">
          <Card className="formula-card feature-formula"><span className="eyebrow">Illustrative family</span><MathBlock>{'F_k:\\{0,1\\}^n\\to\\{0,1\\}'}</MathBlock></Card>
          <div className="split-grid"><Card><span className="eyebrow">With the key</span><h3>Efficient evaluation</h3><AuthorPlaceholder note="Define the evaluation requirement in your own words." /></Card><Card><span className="eyebrow">Without the key</span><h3>Computational indistinguishability</h3><AuthorPlaceholder note="Define the adversary and negligible advantage." /></Card></div>
          <Card className="experiment">
            <div><span>01</span><strong>Challenger</strong><small>choose branch</small></div><b>→</b><div><span>02</span><strong>Oracle</strong><small>Fₖ or R</small></div><b>⇄</b><div><span>03</span><strong>Distinguisher</strong><small>adaptive queries</small></div><b>→</b><div><span>04</span><strong>Output</strong><small>one bit</small></div>
          </Card>
          <Card className="formula-card"><span className="eyebrow">Advantage slot</span><MathBlock>{'\\left|\\Pr[D^{F_k}(1^n)=1]-\\Pr[D^R(1^n)=1]\\right|'}</MathBlock><AuthorPlaceholder note="Define the probability spaces and the negligible-advantage requirement." /></Card>
          <p className="inline-callout">Repeated inputs receive repeated outputs in both branches. <a href="#interactive-demos">Try the oracle simulation →</a></p>
        </Section>

        <Section id="prf-hardness" number="05" title="Main Theorem: Hardness of Learning PRFs" kicker="Conditional result">
          <Card className="theorem-card featured"><span className="theorem-label">Main theorem · security assumption required</span><h3>Hardness of efficient PAC learning</h3><AuthorPlaceholder label="Fully quantified theorem pending" note="State the theorem, model, parameters, and security assumption precisely." /></Card>
          <div className="split-grid"><Card className="formula-card"><MathBlock>{'\\mathcal H_n=\\{F_k:k\\in\\{0,1\\}^n\\}'}</MathBlock></Card><Card className="formula-card"><MathBlock>{'\\log_2|\\mathcal H_n|\\le n'}</MathBlock></Card></div>
          <Stepper title="Reduction from learner to distinguisher" steps={[
            { label: 'Assume an efficient learner' }, { label: 'Create training examples through an oracle' }, { label: 'Train the learner and obtain h' }, { label: 'Query a fresh unseen input' }, { label: 'Compare prediction with oracle output' }, { label: 'Derive a distinguisher / contradiction' },
          ]} />
          <div className="split-grid cases"><Card><span className="eyebrow">Case A</span><h3>Oracle is random</h3><MathBlock>{'\\Pr[h(x)=R(x)]=1/2'}</MathBlock><AuthorPlaceholder note="Justify freshness and independence." /></Card><Card><span className="eyebrow">Case B</span><h3>Oracle is a PRF</h3><MathBlock>{'\\Pr[h(x)=F_k(x)]\\ge 9/16'}</MathBlock><AuthorPlaceholder note="Derive the illustrative ε = δ = 1/4 calculation and list adjustments." /></Card></div>
          <AuthorPlaceholder label="Proof assumptions / limitations pending" note="Cover uniform inputs, i.i.d. samples, efficient hypothesis evaluation, fresh-input collisions, parameters, and conditional security." />
          <div className="contrast"><div><strong>Few samples</strong><span>In principle</span></div><span>+</span><div><strong>No efficient learner</strong><span>Conditional on PRF security</span></div></div>
        </Section>

        <Section id="interactive-demos" number="06" title="Interactive Demonstrations" kicker="Browser-based simulations">
          <p className="section-notice">These are educational simulations, not mathematical proofs or real-world security evaluations.</p>
          <SampleBoundCalculator />
          <AuthorPlaceholder note="Explain what changes when n, epsilon, and delta move." />
          <ParityLearner />
          <AuthorPlaceholder note="Explain equations over GF(2), rank, and when the secret becomes unique." />
          <PrfChallenge />
          <AuthorPlaceholder note="Explain repeated-query consistency and why this local browser game is not a security test." />
        </Section>

        <Section id="implications" number="07" title="Implications & Further Reading" kicker="Boundaries and next steps">
          <div className="placeholder-grid"><AuthorPlaceholder label="Implications pending" note="Write the implications in your own words." /><AuthorPlaceholder label="Caveats pending" note="Separate the conditional theorem from unconditional claims." /><AuthorPlaceholder label="Research connection pending" note="Connect this result to deeper restricted-class hardness results." /></div>
          <div className="bibliography"><div className="card-heading"><span className="eyebrow">Source registry</span><h3>Further reading</h3></div>{(['Learning theory', 'Cryptography', 'Learning hardness', 'Implementation'] as const).map((category) => <div className="source-group" key={category}><h4>{category}</h4>{sources.filter((source) => source.category === category).map((source) => <a key={source.id} href={source.link} target="_blank" rel="noreferrer"><span>{source.id}</span><div><strong>{source.title}</strong><small>{source.authors} · {source.year} · {source.note}</small></div><b>↗</b></a>)}</div>)}</div>
        </Section>

        <footer><a href="#top">CHL</a><p>CS455 · Complexity Theory · Educational prototype</p><p>Examples are browser-based educational simulations.</p></footer>
      </main>
    </div>
  )
}

export default App
