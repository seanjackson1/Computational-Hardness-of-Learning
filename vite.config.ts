import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

function githubPagesBase() {
  if (process.env.BASE_PATH) return process.env.BASE_PATH
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (!repository || repository.endsWith('.github.io')) return '/'
  return `/${repository}/`
}

export default defineConfig({
  plugins: [react()],
  base: githubPagesBase(),
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
