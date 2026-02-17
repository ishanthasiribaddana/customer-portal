import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    proxy: {
      // Student APIs go to FinanceApp api-server
      '/api/students': {
        target: 'http://localhost:8086',
        changeOrigin: true,
      },
      '/api/student-lookup': {
        target: 'http://localhost:8086',
        changeOrigin: true,
      },
      // Auth APIs go to SSOService (independent auth provider)
      '/api/v1/customer/auth': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path: string) => path.replace('/api/v1/customer/auth', '/temco-api/api'),
      },
    },
  },
})
