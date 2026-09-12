<script setup lang="ts">
import type { EditorOptions } from '../types/editor'
import { EditorContent } from '@matrajs/vue'
import { useEditor } from '../composables/useEditor'
import FloatingToolbar from './components/FloatingToolbar.vue'
import 'katex/dist/katex.min.css'

interface Props {
  options?: EditorOptions
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  class: '',
})

const { editor } = useEditor(props.options)
</script>

<template>
  <div class="notion-editor border rounded-lg p-4 mt-5 pl-6 relative bg-background/30" :class="[props.class]">
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
