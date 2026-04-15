import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist', 'undici'],
  },
  plugins: [
    tsconfigPaths(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
})
