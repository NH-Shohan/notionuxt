/**
 * Public type declarations for the notionuxt package.
 *
 * Copied to dist/index.d.ts by the build:lib script. The runtime bundle is
 * produced by Vite; declarations are maintained by hand because the internal
 * component tree resolves through the app alias and is not part of the
 * public surface.
 */
import type { Editor } from '@matrajs/core'
import type { createLowlight } from 'lowlight'
import type { DefineComponent, Ref } from 'vue'

export interface EditorOptions {
  /** Initial HTML content. Falls back to localStorage, then an empty paragraph. */
  content?: string
  /** Whether the editor is editable. Default true. */
  editable?: boolean
  /** Focus the editor on mount. Default true. */
  autofocus?: boolean
  /** Reserved. The placeholder text is currently fixed. */
  placeholder?: string
}

/** The Matra editor instance driving a NotionEditor. */
export type NotionEditorInstance = Editor

type Lowlight = ReturnType<typeof createLowlight>

/** The Notion-style editor component. */
export declare const NotionEditor: DefineComponent<{
  options?: EditorOptions
  class?: string
}>

/**
 * Creates a Matra editor with the full notionuxt extension set, localStorage
 * persistence, and the slash/mention/emoji popups wired up.
 */
export declare function useEditor(options?: EditorOptions): {
  editor: Ref<NotionEditorInstance | null>
  isEditable: Ref<boolean>
  lowlight: Lowlight
}

type EditorCommand = (...args: any[]) => boolean

export interface NotionEditorCommands {
  focus: EditorCommand
  remove: EditorCommand
  insert: EditorCommand
  setParagraph: EditorCommand
  toggleHeading: EditorCommand
  toggleBold: EditorCommand
  toggleItalic: EditorCommand
  toggleStrike: EditorCommand
  toggleUnderline: EditorCommand
  toggleCode: EditorCommand
  toggleHighlight: EditorCommand
  toggleSuperscript: EditorCommand
  toggleSubscript: EditorCommand
  toggleBlockquote: EditorCommand
  toggleBulletList: EditorCommand
  toggleOrderedList: EditorCommand
  toggleCodeBlock: EditorCommand
  toggleTaskList: EditorCommand
  insertDetails: EditorCommand
  unsetDetails: EditorCommand
  setTextAlign: EditorCommand
  insertHorizontalRule: EditorCommand
  insertImage: EditorCommand
  insertYoutube: EditorCommand
  insertInlineMath: EditorCommand
  insertBlockMath: EditorCommand
  setLink: EditorCommand
  unsetLink: EditorCommand
  setColor: EditorCommand
  unsetColor: EditorCommand
  setBackgroundColor: EditorCommand
  unsetBackgroundColor: EditorCommand
}

export type HeadingLevel = 1 | 2 | 3

export interface LinkDialogConfig {
  title?: string
  description?: string
  placeholder?: string
  type?: 'link' | 'youtube' | 'image' | 'inlineMath' | 'blockMath' | 'custom'
}

/** Toolbar and dialog actions bound to an editor ref. */
export declare function useEditorActions(editor: Ref<NotionEditorInstance | null>): {
  toggleBold: () => void
  toggleItalic: () => void
  toggleStrike: () => void
  toggleUnderline: () => void
  toggleLink: () => void
  toggleCode: () => void
  toggleHighlight: () => void
  toggleSuperscript: () => void
  toggleSubscript: () => void
  toggleBlockquote: () => void
  toggleBulletList: () => void
  toggleOrderedList: () => void
  toggleCodeBlock: () => void
  toggleDetails: () => void
  toggleHeading: (level: HeadingLevel) => void
  setParagraph: () => void
  setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => void
  setHorizontalRule: () => void
  addImage: () => void
  onInsertInlineMath: () => void
  onInsertBlockMath: () => void
  toggleTaskList: () => void
  addVideo: () => void
  toggleBackgroundColor: () => void
  toggleTextColor: () => void
  setTextColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  blockButtons: ReadonlyArray<{
    label: string
    icon: string
    action: () => void
    active: string
    level?: HeadingLevel
  }>
  dialogOpen: Ref<boolean>
  dialogConfig: Ref<LinkDialogConfig>
  handleDialogSave: (value: string, file?: File) => void
}

/** The full notionuxt extension array for a Matra editor. */
export declare function createEditorExtensions(lowlight: Lowlight): readonly unknown[]
