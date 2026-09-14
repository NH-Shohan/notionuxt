<script setup lang="ts">
import { EditorContent } from '@matrajs/vue'
import FloatingToolbar from '@/components/editor/components/FloatingToolbar.vue'
import { useEditor } from '@/composables/useEditor'
import 'katex/dist/katex.min.css'

const { editor } = useEditor()
</script>

<template>
  <div class="border rounded-lg p-4 mt-5 pl-6 relative bg-background/30">
    <EditorContent
      v-if="editor"
      :editor="editor"
    />
    <FloatingToolbar
      v-if="editor"
      :editor="editor"
    />
  </div>
</template>
