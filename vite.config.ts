import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/totp.ts',
      // entry: './lib/totp.ts',
      name: 'OTP',
      fileName: (format) => `TOTP.min.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      external: ['crypto'],
      output: {
        globals: {
          crypto: 'crypto'
        }
      }
    }
  },
})
