import type { Level } from '@tiptap/extension-heading'
import type { Editor as EditorType } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import type { LinkDialogConfig } from '../components/dialogs/CommonDialog.vue'
import { ref } from 'vue'

export function useEditorActions(editor: Ref<EditorType | null>) {
  // Dialog state
  const dialogOpen = ref(false)
  const dialogConfig = ref<LinkDialogConfig>({ type: 'link' })
  const currentAction = ref<string>('')

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
            editor.value?.chain().focus().extendMarkRange('link').setLink({ href: value, target: '_blank' }).run()
          }
          else {
            editor.value?.chain().focus().unsetLink().run()
          }
          break
        case 'addImage':
          if (value) {
            if (file) {
              // Convert file to data URL for immediate display
              const reader = new FileReader()
              reader.onload = (e) => {
                const dataUrl = e.target?.result as string
                editor.value?.chain().focus().setImage({ src: dataUrl }).run()
              }
              reader.readAsDataURL(file)
            }
            else {
              editor.value?.chain().focus().setImage({ src: value }).run()
            }
          }
          break
        case 'onInsertInlineMath':
          if (value) {
            editor.value?.chain().focus().insertInlineMath({ latex: value }).run()
          }
          break
        case 'onInsertBlockMath':
          if (value) {
            editor.value?.chain().focus().insertBlockMath({ latex: value }).run()
          }
          break
        case 'addVideo':
          if (value) {
            editor.value?.chain().focus().setYoutubeVideo({ src: value }).run()
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
    editor.value?.chain().focus().toggleBold().run()
  }

  function toggleItalic() {
    editor.value?.chain().focus().toggleItalic().run()
  }

  function toggleStrike() {
    editor.value?.chain().focus().toggleStrike().run()
  }

  function toggleUnderline() {
    editor.value?.chain().focus().toggleUnderline().run()
  }

  function toggleLink() {
    currentAction.value = 'toggleLink'
    openDialog('link', 'Edit Link', 'Enter the URL for the link', 'https://example.com')
  }

  function toggleCode() {
    editor.value?.chain().focus().toggleCode().run()
  }

  function toggleHighlight() {
    editor.value?.chain().focus().toggleHighlight().run()
  }

  function toggleSuperscript() {
    editor.value?.chain().focus().toggleSuperscript().run()
  }

  function toggleSubscript() {
    editor.value?.chain().focus().toggleSubscript().run()
  }

  function toggleBlockquote() {
    editor.value?.chain().focus().toggleBlockquote().run()
  }

  function toggleBulletList() {
    editor.value?.chain().focus().toggleBulletList().run()
  }

  function toggleOrderedList() {
    editor.value?.chain().focus().toggleOrderedList().run()
  }

  function toggleCodeBlock() {
    editor.value?.chain().focus().toggleCodeBlock().run()
  }

  function setDetails() {
    editor.value?.chain().focus().setDetails().run()
  }

  function unsetDetails() {
    editor.value?.chain().focus().unsetDetails().run()
  }

  function toggleDetails() {
    if (editor.value?.isActive('details')) {
      unsetDetails()
    }
    else {
      setDetails()
    }
  }

  function toggleHeading(level: Level) {
    editor.value?.chain().focus().toggleHeading({ level }).run()
  }

  function setParagraph() {
    editor.value?.chain().focus().setParagraph().run()
  }

  function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
    editor.value?.chain().focus().setTextAlign(align).run()
  }

  function setHorizontalRule() {
    editor.value?.chain().focus().setHorizontalRule().run()
  }

  function addImage() {
    currentAction.value = 'addImage'
    openDialog('image', 'Insert Image', 'Upload an image or enter an image URL', 'https://example.com/image.jpg')
  }

  function onInsertInlineMath() {
    const hasSelection = !editor.value?.state.selection.empty
    if (hasSelection) {
      return editor.value?.chain().focus().insertInlineMath({ latex: '' }).run()
    }

    currentAction.value = 'onInsertInlineMath'
    openDialog('inlineMath', 'Insert Inline Math', 'Enter LaTeX math expression', 'E = mc^2')
  }

  function onInsertBlockMath() {
    const hasSelection = !editor.value?.state.selection.empty
    if (hasSelection) {
      return editor.value?.chain().focus().insertBlockMath({ latex: '' }).run()
    }

    currentAction.value = 'onInsertBlockMath'
    openDialog('blockMath', 'Insert Block Math', 'Enter LaTeX math expression', '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}')
  }

  function toggleTaskList() {
    editor.value?.chain().focus().toggleTaskList().run()
  }

  function addVideo() {
    currentAction.value = 'addVideo'
    openDialog('youtube', 'Embed YouTube Video', 'Enter the YouTube video URL', 'https://www.youtube.com/watch?v=...')
  }

  function toggleBackgroundColor() {
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetBackgroundColor().run()
    }
    else {
      editor.value?.chain().focus().setBackgroundColor('#faf594').run()
    }
  }

  function toggleTextColor() {
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetColor().run()
    }
    else {
      editor.value?.chain().focus().setColor('#f00').run()
    }
  }

  function setTextColor(color: string) {
    if (color) {
      editor.value?.chain().focus().setColor(color).run()
    }
    else {
      editor.value?.chain().focus().unsetColor().run()
    }
  }

  function setBackgroundColor(color: string) {
    if (color) {
      editor.value?.chain().focus().setBackgroundColor(color).run()
    }
    else {
      editor.value?.chain().focus().unsetBackgroundColor().run()
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
