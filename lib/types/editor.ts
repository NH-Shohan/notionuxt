import type { Editor } from '@tiptap/vue-3'

export interface EditorOptions {
  content?: string
  editable?: boolean
  autofocus?: boolean
  placeholder?: string
}

export type NotionEditorInstance = Editor

export interface NotionEditorProps {
  options?: EditorOptions
}
