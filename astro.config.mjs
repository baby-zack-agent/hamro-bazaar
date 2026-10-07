import { defineConfig } from 'astro/config';

// Static output: every page prerenders to dist/.
// Admin writes go through /api/* Vercel serverless functions (repo-root api/ dir),
// which commit JSON changes to GitHub and trigger a Vercel redeploy.
export default defineConfig({
  output: 'static',
});
