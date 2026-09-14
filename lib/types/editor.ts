import type { Editor } from '@matrajs/core'

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
