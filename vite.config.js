import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    lib: {
      entry: 'glint/glint.js',
      name: 'Glint',
      fileName: 'glint'
    }
  }
})