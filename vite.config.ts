import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'NotionVueEditor',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@tiptap/vue-3',
        '@tiptap/core',
        '@tiptap/extensions',
        '@tiptap/pm',
        '@tiptap/suggestion',
        'yjs',
        'y-protocols',
        '@tiptap/y-tiptap',
        'lowlight',
        'katex',
        'tippy.js',
        '@floating-ui/dom',
        'highlight.js',
        '@vueuse/core',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'styles/index.css'
          }
          return assetInfo.name || 'assets/[name].[ext]'
        },
      },
    },
    cssCodeSplit: false,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app'),
    },
  },
})
