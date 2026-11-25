# Computational Hardness of Learning

A seven-page CS455 project on sample complexity, PAC learning, and pseudorandom functions. The website reads the student-authored LaTeX in `PAGE_SOURCES/` directly.

The pages use hash-based URLs (`#/introduction`, `#/pac-learning`, and so on), so they work when hosted from a GitHub Pages project subpath.

## Run locally

```bash
npm install
npm run dev
```

## Check the project

```bash
npm run test
npm run build
```

## Edit the site

- Page titles, prose, equations, and references: `PAGE_SOURCES/page1_mine.tex` through `PAGE_SOURCES/page7_mine.tex`
- Page URLs and navigation labels: `src/content/sections.ts`
- LaTeX-to-website formatting: `src/content/latex.ts` and `src/components/ArticleContent.tsx`
- Page layout: `src/App.tsx`
- Sample bound, parity learner, and browser oracle challenge: `src/demos/`
- Visual styling: `src/styles.css`

The LaTeX reader supports the markup used in the sources, including section headings, emphasis, lists, display and inline math, custom math commands, links, and bibliographies. The demos are placed in their corresponding sections in `PAGE_SOURCES/page6_mine.tex`. The parity demo sits after that section's first displayed equation. The demos use browser-local state. The oracle challenge needs Web Crypto in a secure context such as HTTPS or localhost.

## GitHub Pages

The existing `.github/workflows/deploy.yml` workflow deploys `main` automatically. In the repository’s **Settings → Pages** screen, the publishing source must be set to **GitHub Actions**.
