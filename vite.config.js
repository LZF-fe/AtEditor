import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // 这里可以配置Less的选项，比如修改变量等
      },
    },
  },

  resolve: {
    alias: {
      'utils': resolve(__dirname, './src/utils'),
      // 可以添加更多的别名配置...
    },
  },
})
