import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
function githubPagesBase() {
    var _a;
    if (process.env.BASE_PATH)
        return process.env.BASE_PATH;
    var repository = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')[1];
    if (!repository || repository.endsWith('.github.io'))
        return '/';
    return "/".concat(repository, "/");
}
export default defineConfig({
    plugins: [react()],
    base: githubPagesBase(),
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
