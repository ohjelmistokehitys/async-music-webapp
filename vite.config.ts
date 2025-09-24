import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // see https://vite.dev/config/server-options for more options
  server: {
    proxy: {
      "/json-demo": "https://ohjelmistokehitys.github.io/"
    }
  }
})
