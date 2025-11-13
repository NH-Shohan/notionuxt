import type { Editor as EditorType } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import type { EditorOptions } from '../types/editor'
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { Editor } from '@tiptap/vue-3'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { createEditorExtensions } from './useEditorExtensions'

const STORAGE_KEY = 'editor-content'

export function useEditor(options: EditorOptions = {}) {
  const editor = ref<EditorType | null>(null)
  const isEditable = ref(true)
  const lowlight = createLowlight(all)

  lowlight.register('html', html)
  lowlight.register('css', css)
  lowlight.register('js', js)
  lowlight.register('ts', ts)

  onMounted(async () => {
    // Wait for DOM updates to complete
    await nextTick()

    // Load content from localStorage or use provided content
    const savedContent = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

    editor.value = new Editor({
      content: options.content || savedContent || '',
      extensions: createEditorExtensions(editor as Ref<EditorType | null>, lowlight),
      onCreate: ({ editor: currentEditor }) => {
        migrateMathStrings(currentEditor)
      },
      onUpdate: ({ editor: currentEditor }) => {
        // Save content to localStorage whenever user types (unless content was provided)
        if (typeof window !== 'undefined' && !options.content) {
          const html = currentEditor.getHTML()
          localStorage.setItem(STORAGE_KEY, html)
        }
      },
      autofocus: options.autofocus ?? true,
      editable: options.editable ?? true,
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
