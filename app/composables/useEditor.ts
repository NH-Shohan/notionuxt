import type { Editor as NotionEditorInstance } from '@matrajs/core'
import type { Ref } from 'vue'
import { createEditor } from '@matrajs/core'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { watchEmojiPicker } from '@/components/editor/suggestions/emoji-suggestion'
import { watchMentionPicker } from '@/components/editor/suggestions/mention-suggestion'
import { watchSlashCommands } from '@/components/editor/suggestions/slash-command-suggestions'
import { createEditorExtensions, injectEditorStyles } from './useEditorExtensions'

export interface EditorOptions {
  content?: string
  editable?: boolean
  autofocus?: boolean
  placeholder?: string
}

const STORAGE_KEY = 'editor-content'

export function useEditor(options: EditorOptions = {}) {
  const editor: Ref<NotionEditorInstance | null> = shallowRef(null)
  const isEditable = ref(true)
  const lowlight = createLowlight(all)

  lowlight.register('html', html)
  lowlight.register('css', css)
  lowlight.register('js', js)
  lowlight.register('ts', ts)

  let cleanups: Array<() => void> = []

  onMounted(async () => {
    // Wait for DOM updates to complete
    await nextTick()

    injectEditorStyles()

    // Load content from localStorage or use provided content
    const savedContent = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

    const instance = createEditor({
      // An explicit empty paragraph: with no content the schema would fill the
      // document with the highest-priority block, which is the task list.
      content: options.content || savedContent || '<p></p>',
      extensions: createEditorExtensions(lowlight),
      autofocus: options.autofocus ?? true,
      editable: options.editable ?? true,
    }) as unknown as NotionEditorInstance

    // Save content to localStorage whenever user types (unless content was provided)
    cleanups.push(instance.on('change', () => {
      if (typeof window !== 'undefined' && !options.content) {
        localStorage.setItem(STORAGE_KEY, instance.getHTML())
      }
    }))

    // Suggestion popups (slash menu, mentions, emoji) are headless in Matra;
    // these watchers own the popup UI and return their teardown.
    cleanups.push(watchSlashCommands(instance))
    cleanups.push(watchMentionPicker(instance))
    cleanups.push(watchEmojiPicker(instance))

    editor.value = instance
  })

  onBeforeUnmount(() => {
    cleanups.forEach(cleanup => cleanup())
    cleanups = []
    editor.value?.destroy()
    editor.value = null
  })

  return {
    editor,
    isEditable,
    lowlight,
  }
}
