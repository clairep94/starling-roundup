import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { fileURLToPath } from 'node:url'
// import { defineVitestConfig } from '@nuxt/test-utils/config'
import path from 'path'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.includes('pie-') || tag.includes('icon-')
      }
    }
  })],
  test: {
    globals: true,
    // environment: 'nuxt',
    environment: 'jsdom',
    server: {
      deps: {
      }
    },
    setupFiles: ['vitest.setup.ts'],
    include: ['**/*.test.{js,ts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '#imports': path.resolve(__dirname, './.nuxt/imports.d.ts'),
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './')
    }
  }
})
