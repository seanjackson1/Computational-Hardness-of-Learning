# Codex Build Specification — Computational Hardness of Learning

> **Instructions to Codex:** Build the initial working prototype described below in the current repository. This is a CS455 educational website that will ultimately be hosted on **public GitHub Pages**. Implement the application, design, interactive demonstrations, content scaffolding, references, tests, documentation, and deployment configuration. **Do not write or rewrite the final educational/explanatory prose.** See the academic-integrity requirement immediately below.

## 0. Non-negotiable academic-integrity constraint

The course explicitly permits AI tools to build the website (HTML/CSS/JavaScript, layout, diagrams, interactive demonstrations, code), find references, and flag mistakes. **All explanatory/teaching prose on the final site must be written by the student, not generated or rewritten by AI.**

Therefore:

- You **MAY** build the site and all interactive behavior, render mathematics, implement visualizations, create documentation for developers, and provide *neutral interface labels* (e.g., "Next", "Reset", "Number of samples", "Proof step 1", section headings).
- You **MUST NOT** generate polished paragraphs, analogies, motivational text, theorem explanations, proof narration, or final site copy intended to teach the subject.
- Where the site needs educational prose, render a clearly styled placeholder such as **"Author explanation pending"** and put a precise `TODO(author)` comment or structured authoring field in the source. Short authoring prompts may live in developer-only notes, but should not appear as completed explanatory copy.
- The outline, theorem names, formulas, formal definitions, links, and factual *development specifications* provided in this file guide implementation; they are **not permission to populate educational paragraphs** on the live page.
- Do not copy source/book prose or published figures verbatim. Sources should be linked and attributed, not republished.
- Do not use LLM/API calls to generate article content at runtime.
- Make it straightforward for the student to insert their own prose later without touching component logic.

**The deliverable is a polished, usable website prototype with authoring placeholders, not a finished AI-written lesson.**

## 1. Project overview

**Working title:** *The Computational Hardness of Learning: From PAC Learning to Pseudorandom Functions*

**Course:** CS455, Fall 2026 (Complexity Theory).

**Audience:** A student with the mathematical background of CS455 (comfortable with probability, asymptotics, Turing machines, polynomial time, and reductions), but not assumed to know PAC learning or PRFs.

**Central theme:** Distinguish *information-theoretic/sample* learnability from *computationally efficient* learnability. Present the conditional hardness theorem: under the existence/security assumption for pseudorandom functions, some efficiently evaluable function families are not polynomial-time PAC learnable (even over uniform inputs).

**Two principal results to organize the eventual student-written content:**

1. **Finite-class PAC sample bound.** In the realizable, binary-classification setting, a consistent hypothesis in a finite class \(\mathcal H\) generalizes when approximately \(m \ge [\ln|\mathcal H|+\ln(1/\delta)]/\epsilon\) i.i.d. examples are available. This is a **sufficient** sample bound; finding a consistent hypothesis might be computationally expensive.
2. **PRF-based hardness of learning.** If a secure, efficiently evaluable PRF family exists, that family cannot be PAC learned efficiently under the uniform distribution in the standard setting, or else a polynomial-time PRF distinguisher could be constructed. It is a **conditional** theorem. No unconditional cryptographic security is being proved.

**Target product:** An attractive, responsive, single-page educational site with **seven numbered sections**, integrated mathematics, reference citations, step-through proof skeletons, and three browser-based demos. It should be ready to receive the student's explanatory text later.

**Timeline/scoping:** This is the **initial prototype**, not the final submission. Favor cohesive, finished scaffolding and genuinely working demos over broad, half-implemented functionality. Do not create a backend, auth, CMS, or unnecessary dependencies.

## 2. Technology and deployment

Use the following defaults unless the repository already has a sensible comparable stack:

- **React + Vite + TypeScript** (strict mode).
- **CSS** with custom properties for a consistent theme. Plain CSS or CSS Modules preferred; Tailwind is optional only if it already exists.
- **KaTeX** for LaTeX rendering (such as `react-katex` or a thin KaTeX wrapper). Load needed CSS. Provide a fallback for invalid formulas.
- **Inline SVG and simple React visuals** for diagrams; avoid heavyweight visualization dependencies unless beneficial. No externally hosted copyrighted artwork.
- **Vitest** or an equivalent lightweight test framework for core mathematical logic.
- **GitHub Actions -> GitHub Pages** deployment, uploading built `/dist` output.
- **Static hosting only:** all code/demos execute in the browser. No Python service, Node server at runtime, database, paid API, or environment secret required.

### GitHub Pages path handling

Use **section anchors**, not router paths (`/#introduction`, `/#pac-learning`, etc.). GitHub Pages project sites may live at `https://USERNAME.github.io/REPO/`, so handle the Vite `base` configuration correctly:

- Root-hosted `USERNAME.github.io` or local dev: `base: '/'`.
- Repository project site: `base: '/REPO/'`.
- Prefer a small configurable strategy that detects the repo name from `GITHUB_REPOSITORY` during CI, with a documented `BASE_PATH` override; do not hard-code an unknown GitHub username or repo name.
- Use built asset paths from Vite, not absolute `/assets/...` paths that would break under a project subpath.
- Build and deploy on pushes to `main` and allow manual `workflow_dispatch`. Use the official Pages action sequence (`checkout`, `setup-node`, `npm ci`, `npm run build`, `configure-pages`, `upload-pages-artifact`, `deploy-pages`) with appropriate permissions (`contents: read`, `pages: write`, `id-token: write`) and the `github-pages` environment.
- Provide setup instructions: create public repo, push code, select **Settings -> Pages -> Source: GitHub Actions**, then verify deployed link.

**Relevant official documentation:**
- Vite GitHub Pages deployment: https://vite.dev/guide/static-deploy.html
- GitHub Pages configuration: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 3. Design brief

Aim for a scholarly, modern interactive textbook rather than a marketing landing page.

### Visual style

- Light background (`#FAFAF7` or similar), dark charcoal text, restrained dark teal / blue-green accent, a secondary amber accent for interactive elements. Good accessibility contrast; no excessive gradients.
- Clear typography: polished sans-serif UI with a restrained serif or math-friendly style for major titles; math uses KaTeX. Avoid remote font dependencies if possible.
- Generous white space; content max width around 850–950 px; readable body line length, consistent vertical rhythm.
- Numbered section headings, mathematical notation, distinctive theorem/proof cards, footnote/reference affordances, concise callouts, and interactive playground cards.
- Subtle transitions; honor `prefers-reduced-motion`.
- Functional on desktop, tablet, and phone (including narrow 375 px screens). No horizontal page overflow; long mathematics may scroll inside its own container.

### Layout and navigation

- Top header: site title/short title, `CS455` and `Educational Prototype` metadata, link to references.
- Desktop: fixed or sticky **table of contents** at the side; mobile: a menu/dropdown of the seven sections.
- Show active section through IntersectionObserver or equivalent; clicking a section smoothly scrolls to its anchor with correct offset for sticky header.
- A small reading-progress indicator is welcome, but not essential.
- Each section includes `Previous`/`Next` navigation near its end (anchor links, not full page routing).
- Intro hero: title plus a neutral **author-copy placeholder** and a restrained visual graphic (e.g., `examples -> learner -> hypothesis`, `short key -> function`, or binary-grid motif). **Do not author a motivational tagline.**
- Footer: sources, course/project metadata, and a transparent note that examples are educational simulations.

### Reusable components

Implement reusable components instead of seven hard-coded monoliths:

- `SiteLayout`, `TableOfContents`, `Section`, `SectionNavigation`.
- `AuthorContentPlaceholder`: visibly distinguish pending student prose from finished content; optionally accept `authoringNotes` shown only in developer mode or placed in a separate TODO file.
- `MathInline`, `MathBlock`, `TheoremCard`, `ProofStep`, `DefinitionCard`, `CitationList`.
- `DemoCard`, `InputBitString`, `StatusMetric`, `StepControls`.
- Centralized `sources` data and optional reusable citation component; do not duplicate full bibliographic metadata in every JSX file.

## 4. Approved section order and exact anchors

The sections below must appear **in this order**. Every section should already have coherent visual structure and a readily editable place for original student-written explanations.

### Section 1 — Introduction and Motivation

**Anchor:** `#introduction`

**Website structure:**
- Hero with full title and clear nav to `Start learning` (anchor).
- Placeholder for author-written introduction and motivation.
- Interactive/non-interactive diagram showing training examples `\((x_i,f(x_i))\)` going to a learner, producing a hypothesis `\(h\)`, then a fresh input `\(x\)`.
- A two-column teaser distinguishing `Sample complexity` from `Running time`; labels only, and blank/placeholder explanatory bodies.
- A compact `Roadmap` displaying the seven section names.

**Author will later explain:** learning black-box functions, why data sufficiency differs from algorithmic efficiency, connections to cryptography.

**Sources:** Kearns–Vazirani Ch. 1 and 6; MIT Crypto & ML Lectures 2 and 5.

### Section 2 — Foundations of PAC Learning

**Anchor:** `#pac-learning`

**Website structure:**
- Author placeholders for definitions and motivation.
- Visually displayed notation: `\(\mathcal H\)`, `\(D\)`, `\(\epsilon\)`, `\(\delta\)`, `\(h\)`, `\(f\)`.
- A clean mathematical card with a **formal expression to be verified by author**: `\(\Pr_{x\sim D}[h(x)\ne f(x)]\le\epsilon\)` and success probability `\(\ge 1-\delta\)` over samples/randomness.
- Author TODO for rigor: realizable vs agnostic; what randomness the outer probability is over; exact learnability definition and efficiency parameters.
- Placeholder for a short, author-written example and a labeled graphic of train vs fresh inputs.

**Sources:** Kearns–Vazirani Ch. 1; Shalev-Shwartz & Ben-David *Understanding Machine Learning*, introductory PAC and learnability chapters.

### Section 3 — Sample Complexity vs. Computational Complexity

**Anchor:** `#sample-complexity`

**Website structure:**
- Theorem card labeled `Finite hypothesis class sample bound`.
- Mathematical expression for the **sufficient** realizable bound: `\(m\ge [\ln|\mathcal H|+\ln(1/\delta)]/\epsilon\)` (check ceiling and assumptions in author's final write-up).
- **Step-through proof skeleton** with step labels, no proof prose:
  1. Set up `bad hypotheses`.
  2. Probability a fixed bad hypothesis is consistent.
  3. Apply union bound over `\(\mathcal H\)`.
  4. Solve inequality for sample size.
  Each step includes a `TODO(author): proof explanation` slot; formulas may be shown if they are correct and user can verify.
- **Working calculator demo** detailed in §5 below.
- A simple visual comparison `small sample bound` vs `potentially expensive search` without making an unjustified asymptotic claim about every class.

**Sources:** Kearns–Vazirani Ch. 2 (*Occam's Razor*); Shalev-Shwartz & Ben-David (finite-class ERM/sample complexity).

### Section 4 — Pseudorandom Functions

**Anchor:** `#pseudorandom-functions`

**Website structure:**
- Formal notation card `\(F_k:\{0,1\}^n\to\{0,1\}\)`, with note in developer docs that more general PRFs have different key lengths and output lengths.
- Two visually paired columns: `Efficient evaluation with a key` / `Indistinguishability without the key`, with placeholders for the author's explanations.
- **PRF distinguishing experiment diagram:** challenger selects either keyed function `\(F_k\)` or uniformly random function `\(R\)`; adversary queries oracle; adversary outputs a bit; winning/advantage is measured over the experiment.
- Provide math-ready slot for `\(\left|\Pr[D^{F_k}(1^n)=1]-\Pr[D^R(1^n)=1]\right|\)` and an author TODO to define all probability spaces and negligible advantage.
- Highlight repeated-query consistency in the functional demo: both real PRFs and random functions respond consistently to repeated input.
- Link toward the distinguishing game in Section 6.

**Sources:** Goldreich–Goldwasser–Micali (1986); Stanford PRF notes; MIT Crypto & ML Lectures 4–5.

### Section 5 — Main Theorem: Hardness of Learning PRFs

**Anchor:** `#prf-hardness`

**Website structure:**
- Featured main theorem card (conditional theorem) with an obvious placeholder for the author's fully quantified statement.
- Show a compact `\(\mathcal H_n=\{F_k:k\in\{0,1\}^n\}\)` formula card and `\(\log|\mathcal H_n|\le n\)`; make clear via author TODO that the key-size assumption is part of this chosen illustrative family.
- **Interactive step-by-step reduction diagram/skeleton** with these labels, and empty explanatory slots:
  1. `Assume an efficient learner`.
  2. `Create training examples through an oracle`.
  3. `Train the learner and obtain h`.
  4. `Query a fresh unseen input`.
  5. `Compare prediction with oracle output`.
  6. `Derive a distinguisher / contradiction`.
- Two side-by-side case cards: `Oracle is random` and `Oracle is a PRF` with configurable/formula display, but no AI-written paragraph proofs.
- `Proof assumptions / limitations` author TODO: uniform input distribution, i.i.d. examples, efficient evaluability of output hypothesis, fresh input with negligible collision chance, success/error parameters, security assumption.
- One small visual showing `few samples in principle` and `no polynomial-time learner (conditional)`.

**Correctness notes for Codex (implementation and future authoring, NOT publish as AI prose):**
- A useful illustration fixes \(\epsilon=\delta=1/4\). Successful PAC learning happens with probability \(\ge3/4\), and conditional accuracy is \(\ge3/4\); hence \(\Pr[h(x)=F_k(x)]\ge9/16\) in the average case, before accounting for freshness/collision adjustments.
- For a truly random function on an **unqueried** input, the prediction succeeds with probability exactly \(1/2\).
- The distinguisher then has a constant advantage (approximately \(1/16\)), contradictory to PRF security for sufficiently large \(n\). If the test point was drawn uniformly from all inputs, account for probability at most `m / 2^n` that it appeared in training; alternatively sample uniformly from unqueried inputs and handle distribution shift.
- This is a **conditional** complexity-theoretic result, NOT a proof that any real-world PRF or HMAC is unconditionally secure.
- The model should be one where the learner can output an efficiently evaluable hypothesis; do not silently assume access to a slow or uncomputable prediction oracle.
- All narrative explaining the proof belongs to the student.

**Sources:** MIT Crypto & ML Lecture 5 (most direct instructional source); Kearns–Vazirani Ch. 6 for related learning-hardness techniques; original GGM paper for PRFs.

### Section 6 — Interactive Demonstrations

**Anchor:** `#interactive-demos`

**Website structure:**
- Three cards/tabs with real functionality as specified in §5.
- Each demo includes input controls, visual output, reset behavior, and a clearly labeled `Author explanation pending` content area.
- Link from Sections 3 and 4 to the corresponding demo.
- Label simulation outcomes as examples, NOT mathematical proofs; avoid claims like "this experiment proves security".

**Sources:** MIT Crypto & ML Lectures 4–5; MDN Web Crypto API. The first two demos are mathematical/educational illustrations rather than direct implementations from a cited book.

### Section 7 — Implications and Further Reading

**Anchor:** `#implications`

**Website structure:**
- Two or three styled author-prose placeholders for eventual implications, caveats, and connection to current ML research.
- Factual `Further reading` bibliography displaying title, author(s), year, relevant chapter/lecture, and outbound link; organized by `Learning theory`, `Cryptography`, `Learning hardness`, and `Implementation`.
- Distinguish the **elementary PRF-family hardness proof** from deeper, more specialized hardness results for restricted concept classes (e.g. Boolean formulas or some network classes).
- A small final navigational element `Back to top`.

**Sources:** Kearns–Vazirani Ch. 6; Kearns–Valiant paper; MIT Crypto & ML Lecture 5.

## 5. Working interactive demonstrations — implementation requirements

### Demo A — Finite-class PAC sample bound calculator (must work in prototype)

**Location:** Embed compact version in Section 3, optionally reuse in Section 6.

**Inputs:**
- `n` = illustrative key length (integer 2–40, default ~12).
- `epsilon` (0.01–0.5; default 0.1).
- `delta` (0.001–0.5; default 0.05).
- Optional switch: show sample bound for `|H| = 2^n` versus a directly entered finite `|H|` value. For simplicity, `2^n` alone is acceptable for MVP.

**Computation:**
- Compute `m = ceil((n * ln(2) + ln(1/delta))/epsilon)` when using \(|\mathcal H|=2^n\).
- Display the result with correctly formatted inputs/formula; this is a **sufficient** bound, not a claim that exactly `m` examples are necessary.
- Avoid overflow for `2^n` by calculating `ln|H|` directly.

**UI:** A clean input panel and a changing `m` readout; optionally show a chart or tiles indicating how `m` changes with `epsilon`. Include a placeholder for the author's interpretation.

**Tests:** Check formula for a few known settings, validate bounds and ceiling, and verify `m` increases as epsilon/delta decrease.

### Demo B — Learn a parity function (must work in prototype)

**Location:** Section 6; optionally link from Section 1.

**Mathematical definition:** For hidden `s in {0,1}^n`, `f_s(x) = (s dot x) mod 2` over GF(2).

**Controls:**
- `n` = 4–8 (maybe up to 10 if layout permits).
- `Generate new secret`, `Sample one`, `Sample five`, `Predict`, `Reveal secret`, `Reset`.
- A binary input widget for a learner/visitor to propose a fresh test input.

**Logic:**
- Randomly choose a hidden `s`, sample uniform binary inputs `x`, display correct labels and keep a table of observations.
- Use actual **GF(2) Gaussian elimination** to solve the accumulated linear equations. Track rank and whether the secret is uniquely determined.
- When the system is underdetermined, clearly show `Multiple consistent secrets` (never pretend the true secret has been recovered). Show a representative solution only if properly qualified, or simply hold off until unique.
- Once rank reaches `n`, display the recovered secret and allow prediction on arbitrary `x`. Compare predictions with actual labels.
- Distinct samples are not mathematically required for Gaussian elimination, but repeated samples may give no extra rank. Show this correctly.

**Visuals:** Equation table showing input bit vectors and outputs; rank/progress indicator `rank r / n`; small animated row reduction or rank highlight if feasible without overengineering.

**Tests:** GF(2) solver returns correct unique solution for full-rank examples, handles dependent rows and underdetermined systems, and never asserts unique when rank < n.

### Demo C — PRF vs random-function oracle challenge (must work if technically feasible; otherwise ship a plainly marked scaffold, not a fake game)

**Location:** Section 6; link from Section 4.

**Concept:** An educational imitation of the PRF distinguishing experiment. This is a **local browser simulation**, not a cryptographically secure challenger with secret state inaccessible to the player.

**Controls:**
- `New challenge`.
- Input `x` as an `n`-bit binary string (suggest `n = 12` or `16`).
- `Query oracle` (allow ~20–30 queries per round).
- `Guess: PRF / Random`.
- `Reveal challenge / Reset`.
- Optionally allow a prediction on an unqueried input to emphasize held-out behavior.

**Oracle implementation:**
- When a new challenge begins, select PRF or random uniformly using `crypto.getRandomValues`, not `Math.random` for security-sensitive simulation randomness.
- **PRF branch:** Generate a fresh non-extractable HMAC-SHA-256 `CryptoKey` in browser via `crypto.subtle.generateKey`. On each binary input, compute HMAC via `crypto.subtle.sign`, then use (for example) the first digest bit as the oracle's output. This is a practical keyed-function **illustration**, not a proof of HMAC PRF security.
- **Random branch:** Implement a random function using a `Map<string, 0|1>` with lazy sampling: sample independent fair bits for first-seen inputs; return the cached answer on repeated inputs.
- No network requests, no exporting secrets, no persistence of keys, no hard-coded keys.
- Both branches must be consistent on repeats. Prevent malformed inputs. Only reveal which branch was chosen after a user commits a guess or explicitly reveals.
- When `crypto.subtle` is unavailable, explain the browser requirement and show an explicit unavailable state rather than crashing. GitHub Pages uses HTTPS; local `localhost` should also support a secure context.

**Threat-model limitation:** Because the entire challenge runs inside the visitor's browser, a technically capable visitor can inspect the code and runtime state. Do **not** describe this as an actual secure oracle game or use demo win rates as evidence of PRF security. Put a visible, concise mechanical notice near the game: `Local educational simulation — not a secure cryptographic challenge.`

**Tests:** Random-function consistency, input validation, stable PRF output on repeated inputs given a key, correct game reset/reveal state transitions; do not make brittle tests based on presumed 50/50 observed results in tiny samples.

## 6. Mathematics, proof scaffolding, and citations

- All visible formulas should render cleanly via KaTeX and survive browser refresh and GitHub Pages subpath deploy.
- Provide components that support inline and display formulas without duplicating markup.
- Do not silently simplify or distort any quantified theorem. Place author TODOs for missing assumptions, formal definitions, and proof justifications.
- **Keep the crucial distinction** between information-theoretic learning using potentially exponential search and polynomial-time learning.
- **Keep the security assumption visible** in the main theorem title/card.
- Avoid implying that all short-description or efficiently computable classes are difficult to learn. This is an existence/hardness construction.
- PRF security is a **computational** indistinguishability guarantee against efficient distinguishers. It is not identical to literal statistical indistinguishability.
- The random oracle in this project is a **truly random function with consistent answers**, not fresh independent coins for repeated queries.
- If a proof cannot be accurately displayed without the student's prose, show the proof structure with `Author proof pending` placeholders rather than an incomplete or misleading proof.
- Source citations must point to genuine resources. Do not invent page numbers, theorem numbers, quotations, or permissions.
- Include references as numbered labels or author-year links that users can follow, and map each website section to its corresponding reading in developer documentation.

## 7. Source registry (real links; use these exact sources)

Create a centralized bibliography with metadata (`id`, `title`, `authors`, `year`, `link`, `notes`, `usedInSections`). Use the following as the initial list. The notes here are *for planning*, not final teaching prose.

| ID | Reference and link | Relevant sections |
| --- | --- | --- |
| `KV94` | Michael J. Kearns & Umesh V. Vazirani, *An Introduction to Computational Learning Theory* (MIT Press, 1994). https://mitpress.mit.edu/9780262111935/an-introduction-to-computational-learning-theory/ — Chapter 1 (*The Probably Approximately Correct Learning Model*), Chapter 2 (*Occam's Razor*), Chapter 6 (*Inherent Unpredictability*). | 1, 2, 3, 5, 7 |
| `SSBD14` | Shai Shalev-Shwartz & Shai Ben-David, *Understanding Machine Learning: From Theory to Algorithms*. https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/ — PAC and finite-class learning material. | 2, 3 |
| `MIT26` | MIT 6.S976 / 18.S996, *Cryptography and Machine Learning: Foundations and Frontiers* (Spring 2026). https://mlcrypto.mit.edu/course/ — Lectures 2, 4, and especially 5. | 1, 2, 4, 5, 6, 7 |
| `GGM86` | Oded Goldreich, Shafi Goldwasser, Silvio Micali, *How to Construct Random Functions*, JACM 33(4), 1986. https://doi.org/10.1145/6490.6503 | 4, 5 |
| `STANFORD-PRF` | Stanford cryptography notes, *Pseudo-Random Functions*. https://crypto.stanford.edu/pbc/notes/crypto/prf.html | 4, 5 |
| `KV94-RELATED` | Michael Kearns & Leslie Valiant, *Cryptographic Limitations on Learning Boolean Formulae and Finite Automata*, JACM (1994; conference version 1989). https://www.cis.upenn.edu/~mkearns/papers/crypto.pdf — a **different** paper than the Kearns–Vazirani textbook; use as related work, not as the direct source of the elementary PRF proof. | 7 |
| `MDN-WEBCRYPTO` | MDN, *Web Crypto API*. https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API | 6 (implementation) |
| `VITE-PAGES` | Vite, *Deploying a Static Site*. https://vite.dev/guide/static-deploy.html | developer docs |
| `GH-PAGES` | GitHub Docs, *Configuring a publishing source for your GitHub Pages site*. https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site | developer docs |

**Important distinction:** Kearns & **Vazirani** authored the 1994 *textbook*. Kearns & **Valiant** authored the related hardness *paper*. Keep both correctly attributed.

Don't assume publicly available full text for the Kearns–Vazirani book; link to the publisher, and do not embed unauthorized scanned PDFs.

## 8. Suggested architecture and content-editing workflow

Suggested files (adjust names to match existing repository conventions):

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── AUTHOR_TODO.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/global.css
│   ├── data/sources.ts
│   ├── content/sections.ts
│   ├── components/
│   │   ├── SiteLayout.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── Section.tsx
│   │   ├── MathText.tsx
│   │   ├── TheoremCard.tsx
│   │   ├── ProofStepper.tsx
│   │   ├── AuthorContentPlaceholder.tsx
│   │   └── CitationList.tsx
│   ├── sections/
│   │   ├── Introduction.tsx
│   │   ├── PacLearning.tsx
│   │   ├── SampleComplexity.tsx
│   │   ├── PseudorandomFunctions.tsx
│   │   ├── PrfHardness.tsx
│   │   ├── InteractiveDemos.tsx
│   │   └── Implications.tsx
│   ├── demos/
│   │   ├── SampleBoundCalculator.tsx
│   │   ├── ParityLearner.tsx
│   │   └── PrfDistinguishingGame.tsx
│   └── lib/
│       ├── finiteClassBound.ts
│       ├── gf2.ts
│       ├── cryptoOracles.ts
│       └── __tests__/
└── public/
    └── favicon.svg
```

**Content separation rules:**
- Store all editable student-written educational text in a single clearly documented place (`src/content/sections.ts`, or one Markdown file per section if Markdown rendering is configured). Initially the editable explanation fields should be empty or TODO placeholders.
- Math components and visualizations should be separate from editable prose.
- The `AUTHOR_TODO.md` checklist should list, per section, what the student still needs to write and which textbook/lecture readings to consult.
- A `README.md` must tell the student where to enter prose, how to add citations, and which code files implement each demo.
- When author prose is absent, render an attractive empty-state placeholder. Never populate it with invented explanatory content.

## 9. Build/test/quality requirements

1. Inspect the repo before editing. Preserve existing user work and dependencies if applicable; if empty, initialize the application.
2. Implement all seven named sections with proper anchors and coherent visual layouts.
3. Desktop and mobile navigation must work; active/selected section should be apparent.
4. KaTeX equations should render; bad or missing text should not crash the application.
5. The finite-class bound calculator must actually compute values and update live.
6. The parity learner must actually solve GF(2) equations and handle nonunique cases correctly.
7. The PRF/random oracle challenge should work as a browser-only simulation; if browser limitations prevent it, present a clearly identified incomplete scaffold and document precisely what remains.
8. Interactive controls must be functional, keyboard accessible, properly labeled, and offer clear reset/restart actions.
9. Use semantic headings (`h1` once, `h2` for sections), buttons for actions, proper links for navigation, focus styles, sufficient contrast, and `aria-live` for important demo status changes.
10. The site should be reasonably polished at 375 px mobile width and common desktop widths; no clipping or runaway scrolling.
11. Use no backend, no embedded API keys, no actual secrets, and no external analytics. Crypto demo keys may be ephemeral in-browser keys only.
12. Include unit tests for pure mathematics (`finiteClassBound`, GF(2) solver) and game state logic where practical.
13. Provide useful npm scripts: `dev`, `build`, `preview`, `test` (and `lint` if configured).
14. Run dependency installation, tests, and production build; fix compile/type failures. If possible inspect the rendered site with local preview or screenshots.
15. Provide working GitHub Pages Actions deployment workflow, with correct `base` handling and documentation.
16. Keep explanatory paragraphs **blank for the student**, with section-specific TODOs and sources available to guide original writing.
17. Do not overwrite or commit any personal data, course files, copyrighted book scans, or private materials to the public repo.
18. End with a concise report of what was built, tests/build results, files to edit for student-authored text, and exact setup steps left for the repo owner (including enabling Pages).

## 10. Priority order and scope control

**P0 — Must complete now:** App scaffolding, polished layout/navigation, seven sections, author placeholders, source registry, theorem/proof UI skeletons, finite-class bound calculator, parity learner, README and AUTHOR_TODO, local build/test, GitHub Pages workflow.

**P1 — Strongly preferred:** Fully functional HMAC-vs-random browser-only oracle challenge with threat-model notice and tests; responsive polish; proof-step animation; visual diagrams.

**P2 — Later, not required in the initial prototype:** Student-written explanations and proofs; additional quizzes, progress persistence, sophisticated statistical charts, extra crypto demos, downloadable lecture notes, full animations, custom domains, analytics.

If the request is too large, **finish P0 completely** rather than spreading effort across incomplete features. Do not ask for a GitHub username or repo name to get started: make the Pages path configurable and document how the owner will set it.

## 11. Definition of done

The prototype is ready when the owner can run:

```bash
npm install
npm run dev
npm run test
npm run build
```

and see a polished seven-section site with a working calculator and parity learning demo; navigation, references, math, and author placeholders all work; the compiled artifact can be deployed from GitHub Actions to GitHub Pages; and the owner can identify exactly where to write their own teaching material before the final submission.

**Proceed to implement the prototype in the repository now.**
