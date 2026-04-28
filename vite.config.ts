import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// import eslint from 'vite-plugin-eslint2'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 本地 Express + Prisma（默认 3000 端口）
      '/local-api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        // 本地代理到本机后端时去掉 `/local-api` 前缀，保持与后端路由一致
        rewrite: (path) => path.replace(/^\/local-api/, ''),
      },
    }
  }
})
