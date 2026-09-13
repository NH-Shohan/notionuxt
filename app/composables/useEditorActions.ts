import type { Editor as NotionEditorInstance } from '@matrajs/core'
import type { Ref } from 'vue'
import type { LinkDialogConfig } from '@/components/editor/dialogs/CommonDialog.vue'
import { ref } from 'vue'

export type HeadingLevel = 1 | 2 | 3

type EditorCommand = (...args: any[]) => boolean

// The commands this package drives, spelled out so strict index-access
// checking sees them as always-present callables.
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

export function useEditorActions(editor: Ref<NotionEditorInstance | null>) {
  // Dialog state
  const dialogOpen = ref(false)
  const dialogConfig = ref<LinkDialogConfig>({ type: 'link' })
  const currentAction = ref<string>('')

  function run(commands: (c: NotionEditorCommands) => void) {
    const instance = editor.value
    if (!instance)
      return
    try {
      instance.batch((raw) => {
        const c = raw as unknown as NotionEditorCommands
        c.focus()
        commands(c)
      })
    }
    catch (error) {
      // Matra >= 1.1.6 refuses a throwing command inside a batch itself;
      // this keeps older engines from taking the toolbar down with them.
      console.warn('Error executing editor command:', error)
    }
  }

  // Dialog handlers
  function handleDialogSave(value: string, file?: File) {
    const action = currentAction.value
    currentAction.value = ''

    if (!value && !file)
      return

    try {
      switch (action) {
        case 'toggleLink':
          if (value) {
            run(c => c.setLink({ href: value, target: '_blank' }))
          }
          else {
            run(c => c.unsetLink())
          }
          break
        case 'addImage':
          if (value) {
            if (file) {
              // Convert file to data URL for immediate display
              const reader = new FileReader()
              reader.onload = (e) => {
                const dataUrl = e.target?.result as string
                run(c => c.insertImage({ src: dataUrl }))
              }
              reader.readAsDataURL(file)
            }
            else {
              run(c => c.insertImage({ src: value }))
            }
          }
          break
        case 'onInsertInlineMath':
          if (value) {
            run(c => c.insertInlineMath(value))
          }
          break
        case 'onInsertBlockMath':
          if (value) {
            run(c => c.insertBlockMath(value))
          }
          break
        case 'addVideo':
          if (value) {
            run(c => c.insertYoutube({ src: value }))
          }
          break
      }
    }
    catch (error) {
      console.warn('Error executing action:', error)
    }

    dialogOpen.value = false
  }

  function openDialog(type: LinkDialogConfig['type'], title?: string, description?: string, placeholder?: string) {
    dialogConfig.value = {
      type,
      title,
      description,
      placeholder,
    }
    dialogOpen.value = true
  }
  function toggleBold() {
    run(c => c.toggleBold())
  }

  function toggleItalic() {
    run(c => c.toggleItalic())
  }

  function toggleStrike() {
    run(c => c.toggleStrike())
  }

  function toggleUnderline() {
    run(c => c.toggleUnderline())
  }

  function toggleLink() {
    currentAction.value = 'toggleLink'
    openDialog('link', 'Edit Link', 'Enter the URL for the link', 'https://example.com')
  }

  function toggleCode() {
    run(c => c.toggleCode())
  }

  function toggleHighlight() {
    run(c => c.toggleHighlight())
  }

  function toggleSuperscript() {
    run(c => c.toggleSuperscript())
  }

  function toggleSubscript() {
    run(c => c.toggleSubscript())
  }

  function toggleBlockquote() {
    run(c => c.toggleBlockquote())
  }

  function toggleBulletList() {
    run(c => c.toggleBulletList())
  }

  function toggleOrderedList() {
    run(c => c.toggleOrderedList())
  }

  function toggleCodeBlock() {
    run(c => c.toggleCodeBlock())
  }

  function setDetails() {
    run(c => c.insertDetails())
  }

  function unsetDetails() {
    run(c => c.unsetDetails())
  }

  function toggleDetails() {
    if (editor.value?.isActive('details')) {
      unsetDetails()
    }
    else {
      setDetails()
    }
  }

  function toggleHeading(level: HeadingLevel) {
    run(c => c.toggleHeading(level))
  }

  function setParagraph() {
    run(c => c.setParagraph())
  }

  function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
    run(c => c.setTextAlign(align))
  }

  function setHorizontalRule() {
    run(c => c.insertHorizontalRule())
  }

  function addImage() {
    currentAction.value = 'addImage'
    openDialog('image', 'Insert Image', 'Upload an image or enter an image URL', 'https://example.com/image.jpg')
  }

  // With a selection, the selected text becomes the formula, matching the
  // previous behaviour. Without one, a dialog asks for the LaTeX source.
  function selectedText() {
    if (typeof window === 'undefined')
      return ''
    return window.getSelection()?.toString().trim() ?? ''
  }

  function onInsertInlineMath() {
    const hasSelection = !editor.value?.selection.empty
    if (hasSelection) {
      const latex = selectedText()
      if (latex) {
        return run(c => c.insertInlineMath(latex))
      }
    }

    currentAction.value = 'onInsertInlineMath'
    openDialog('inlineMath', 'Insert Inline Math', 'Enter LaTeX math expression', 'E = mc^2')
  }

  function onInsertBlockMath() {
    const hasSelection = !editor.value?.selection.empty
    if (hasSelection) {
      const latex = selectedText()
      if (latex) {
        return run(c => c.insertBlockMath(latex))
      }
    }

    currentAction.value = 'onInsertBlockMath'
    openDialog('blockMath', 'Insert Block Math', 'Enter LaTeX math expression', '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}')
  }

  function toggleTaskList() {
    run(c => c.toggleTaskList())
  }

  function addVideo() {
    currentAction.value = 'addVideo'
    openDialog('youtube', 'Embed YouTube Video', 'Enter the YouTube video URL', 'https://www.youtube.com/watch?v=...')
  }

  function toggleBackgroundColor() {
    if (editor.value?.isActive('textStyle')) {
      run(c => c.unsetBackgroundColor())
    }
    else {
      run(c => c.setBackgroundColor('#faf594'))
    }
  }

  function toggleTextColor() {
    if (editor.value?.isActive('textStyle')) {
      run(c => c.unsetColor())
    }
    else {
      run(c => c.setColor('#f00'))
    }
  }

  function setTextColor(color: string) {
    if (color) {
      run(c => c.setColor(color))
    }
    else {
      run(c => c.unsetColor())
    }
  }

  function setBackgroundColor(color: string) {
    if (color) {
      run(c => c.setBackgroundColor(color))
    }
    else {
      run(c => c.unsetBackgroundColor())
    }
  }

  const blockButtons = [
    { label: 'Paragraph', icon: 'TypeIcon', action: () => setParagraph(), active: 'paragraph' },
    { label: 'Heading 1', icon: 'Heading1Icon', action: () => toggleHeading(1), active: 'heading', level: 1 },
    { label: 'Heading 2', icon: 'Heading2Icon', action: () => toggleHeading(2), active: 'heading', level: 2 },
    { label: 'Heading 3', icon: 'Heading3Icon', action: () => toggleHeading(3), active: 'heading', level: 3 },
    { label: 'Bullet List', icon: 'ListIcon', action: () => toggleBulletList(), active: 'bulletList' },
    { label: 'Numbered List', icon: 'ListOrderedIcon', action: () => toggleOrderedList(), active: 'orderedList' },
    { label: 'Todo List', icon: 'CheckSquareIcon', action: () => toggleTaskList(), active: 'taskList' },
    { label: 'Quote', icon: 'QuoteIcon', action: () => toggleBlockquote(), active: 'blockquote' },
  ] as const

  return {
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleUnderline,
    toggleLink,
    toggleCode,
    toggleHighlight,
    toggleSuperscript,
    toggleSubscript,
    toggleBlockquote,
    toggleBulletList,
    toggleOrderedList,
    toggleCodeBlock,
    toggleDetails,
    toggleHeading,
    setParagraph,
    setTextAlign,
    setHorizontalRule,
    addImage,
    onInsertInlineMath,
    onInsertBlockMath,
    toggleTaskList,
    addVideo,
    toggleBackgroundColor,
    toggleTextColor,
    setTextColor,
    setBackgroundColor,
    blockButtons,
    // Dialog-related properties
    dialogOpen,
    dialogConfig,
    handleDialogSave,
  }
}
