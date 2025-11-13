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
        'yjs',
        'y-protocols',
        '@tiptap/y-tiptap',
        'lowlight',
        'katex',
        'tippy.js',
        '@floating-ui/dom',
        'highlight.js',
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
    minify: 'esbuild',
    cssMinify: true,
    target: 'es2015',
    reportCompressedSize: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app'),
    },
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
  },
})
