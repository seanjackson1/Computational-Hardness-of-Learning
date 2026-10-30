# Computational Hardness of Learning

A deliberately minimal seven-page outline for the current CS455 project milestone. Each page contains only its title, a short description of what will eventually go there, and a `To Be Filled In` placeholder.

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

## Edit the outline

- Page names and descriptions: `src/content/sections.ts`
- Page layout: `src/App.tsx`
- Visual styling: `src/styles.css`

## Return to the full interactive prototype

The previous version is preserved on the GitHub branch:

```text
archive/full-interactive-prototype
```

To view its code without changing the current branch:

```bash
git show archive/full-interactive-prototype:src/App.tsx
```

To switch to it:

```bash
git switch archive/full-interactive-prototype
```

Return to the minimal version with:

```bash
git switch main
```

## GitHub Pages

The existing `.github/workflows/deploy.yml` workflow deploys `main` automatically. In the repository’s **Settings → Pages** screen, the publishing source must be set to **GitHub Actions**.
