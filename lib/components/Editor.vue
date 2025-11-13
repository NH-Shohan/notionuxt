<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'
import { EditorContent } from '@tiptap/vue-3'
import { useEditor } from '../composables/useEditor'
import FloatingToolbar from './components/FloatingToolbar.vue'
import 'katex/dist/katex.min.css'

const { editor } = useEditor()
</script>

<template>
  <div class="border rounded-lg p-4 mt-5 pl-6 relative bg-background/30">
    <DragHandle
      v-if="editor"
      :editor="editor as EditorType"
      :compute-position-config="{ placement: 'left-start', strategy: 'absolute' }"
    >
      <div class="drag-handle-icon">
        ⠿
      </div>
    </DragHandle>
    <EditorContent :editor="editor as EditorType" />
    <FloatingToolbar
      v-if="editor"
      :editor="editor as EditorType"
    />
  </div>
</template>
