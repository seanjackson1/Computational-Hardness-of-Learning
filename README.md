# Computational Hardness of Learning

A responsive, single-page CS455 educational outline about PAC learning, sample complexity, pseudorandom functions, and conditional hardness of efficient learning.

The project deliberately contains author placeholders rather than finished explanatory prose. See [`AUTHOR_TODO.md`](./AUTHOR_TODO.md) before adding course content.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`.

## Check the project

```bash
npm run test
npm run build
npm run preview
```

The production site is written to `dist/`.

## Where to edit

- `src/App.tsx`: section structure, diagrams, proof skeletons, and current author placeholders.
- `src/content/sections.ts`: section metadata and the intended home for student-authored content fields.
- `src/data/sources.ts`: centralized bibliography.
- `src/demos/`: calculator, parity learner, and oracle challenge interfaces.
- `src/lib/`: tested mathematical and browser-crypto logic.
- `src/styles.css`: responsive visual system.
- `AUTHOR_TODO.md`: section-by-section student writing checklist.

## Public GitHub Pages deployment

The included workflow builds and deploys the site on every push to `main`. `vite.config.ts` detects the repository name from `GITHUB_REPOSITORY`, so project sites work at `https://USERNAME.github.io/REPOSITORY/`. Set `BASE_PATH` only when you need an explicit override.

1. Create a **public**, empty GitHub repository. Do not initialize it with a README, because this project already has one.
2. From this folder, initialize Git and push:

   ```bash
   git init
   git add .
   git commit -m "Build learning hardness website outline"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for the `Deploy to GitHub Pages` workflow to finish.
6. Visit `https://USERNAME.github.io/REPOSITORY/`.

For a user/organization root repository named `USERNAME.github.io`, the same configuration deploys at `https://USERNAME.github.io/`.

## Notes

- The site uses section anchors rather than client-side routes, which avoids refresh failures on GitHub Pages.
- The HMAC challenge requires a secure context. GitHub Pages provides HTTPS; `localhost` is also supported by browsers.
- The browser game keeps its key and random-function table only for the current page session. It is an educational local simulation, not a secure remote challenge.
- No backend, API key, analytics, or runtime server is required.
