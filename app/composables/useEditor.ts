import type { Editor as EditorType } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { Editor } from '@tiptap/vue-3'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createEditorExtensions } from './useEditorExtensions'

export function useEditor() {
  const editor = ref<EditorType | null>(null)
  const isEditable = ref(true)
  const lowlight = createLowlight(all)

  lowlight.register('html', html)
  lowlight.register('css', css)
  lowlight.register('js', js)
  lowlight.register('ts', ts)

  onMounted(() => {
    editor.value = new Editor({
      content: '',
      extensions: createEditorExtensions(editor as Ref<EditorType | null>, lowlight),
      onCreate: ({ editor: currentEditor }) => {
        migrateMathStrings(currentEditor)
      },
      autofocus: true,
      editable: true,
      injectCSS: true,
    })
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  return {
    editor,
    isEditable,
    lowlight,
  }
}
