<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3';
import type { Ref } from 'vue';
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3';
import { EditorContent } from '@tiptap/vue-3';
import { useEditor } from '@/composables/useEditor';
import { useEditorActions } from '@/composables/useEditorActions';
import { useEditorToolbar } from '@/composables/useEditorToolbar';
import 'katex/dist/katex.min.css';

const { editor } = useEditor();
const editorActions = useEditorActions(editor as Ref<EditorType | null>);
const { toolbarActions } = useEditorToolbar(editorActions);
</script>

<template>
  <div class="space-x-2 space-y-2">
    <UiButton
      v-for="action in toolbarActions"
      :key="action.icon.name"
      variant="outline"
      size="icon"
      @click="action.action"
    >
      <component :is="action.icon" />
    </UiButton>
  </div>

  <div class="border rounded-lg p-4 mt-5 pl-6 relative">
    <DragHandle
      v-if="editor"
      :editor="editor as EditorType"
      :compute-position-config="{ placement: 'left-start', strategy: 'absolute' }"
    >
      <div class="drag-handle-icon">⠿</div>
    </DragHandle>
    <EditorContent :editor="editor as EditorType" />
  </div>
</template>
