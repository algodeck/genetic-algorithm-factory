import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'component/ga-artboard.js',
      fileName: 'ga-artboard-component',
      formats: ['es']
    }
  }
})
