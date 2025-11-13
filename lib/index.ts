// Main exports for the Notion-style editor package
// Import styles
import './styles/index.css'

export { default as NotionEditor } from './components/NotionEditor.vue'
export { useEditor } from './composables/useEditor'
export { useEditorActions } from './composables/useEditorActions'
export { createEditorExtensions } from './composables/useEditorExtensions'

// Types
export type { EditorOptions } from './types/editor'
