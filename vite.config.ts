import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist', 'undici'],
  },
  define: {
    'process.env': {},
  },
  plugins: [tsconfigPaths(), viteReact()],
})
