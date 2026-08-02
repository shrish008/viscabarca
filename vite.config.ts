import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ARTIFACT_BUILD forces every dynamic import() (route-level code
// splitting, the lazy-loaded jsPDF module) into a single bundle. Normal
// deploys want those as separate chunks for performance; a self-contained
// single-file preview (no server to fetch extra chunks from) needs them
// inlined or those code paths silently fail at runtime.
const isArtifactBuild = process.env.ARTIFACT_BUILD === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: isArtifactBuild
    ? { rollupOptions: { output: { codeSplitting: false } } }
    : undefined,
})
