import type { Editor as EditorType } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import Document from '@tiptap/extension-document'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import FileHandler from '@tiptap/extension-file-handler'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list'
import { Mathematics } from '@tiptap/extension-mathematics'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import { BackgroundColor, Color, TextStyle } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { Dropcursor, Gapcursor, Placeholder, UndoRedo } from '@tiptap/extensions'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TaskItemComponent from '@/components/editor/components/TaskItemComponent.vue'
import SlashCommand from '@/components/editor/extensions/SlashCommand'
import EmojiSuggestion from '@/components/editor/suggestions/emoji-suggestion.js'
import mentionSuggestion from '@/components/editor/suggestions/mention-suggestion.js'

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return VueNodeViewRenderer(TaskItemComponent)
  },
})

export function createEditorExtensions(
  editor: Ref<EditorType | null>,
  lowlight: ReturnType<typeof import('lowlight').createLowlight>,
) {
  return [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Bold,
    Italic,
    Strike,
    Underline,
    Link,
    Code,
    Highlight.configure({ multicolor: true }),
    Superscript,
    Subscript,
    Blockquote,
    BulletList,
    OrderedList,
    ListItem,
    CodeBlockLowlight.configure({
      lowlight,
      enableTabIndentation: true,
      defaultLanguage: 'javascript',
      tabSize: 2,
    }),
    Details.configure({
      persist: false,
      openClassName: 'is-open',
      HTMLAttributes: {
        class: 'details',
      },
    }),
    DetailsSummary,
    DetailsContent,
    Placeholder.configure({
      includeChildren: true,
      placeholder: 'Press / to start...',
    }),
    SlashCommand,
    HorizontalRule,
    Dropcursor,
    Image.configure({
      inline: true,
      resize: {
        enabled: true,
        directions: ['bottom', 'right', 'bottom-right'],
        minWidth: 200,
        minHeight: 200,
        alwaysPreserveAspectRatio: true,
      },
    }),
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
      suggestion: EmojiSuggestion,
    }),
    Mathematics.configure({
      blockOptions: {
        onClick: (node, pos) => {
          const newCalculation = prompt('Enter new calculation:', node.attrs.latex)
          if (newCalculation) {
            editor.value?.chain().setNodeSelection(pos).updateBlockMath({ latex: newCalculation }).focus().run()
          }
        },
      },
      inlineOptions: {
        onClick: (node, pos) => {
          const newCalculation = prompt('Enter new calculation:', node.attrs.latex)
          if (newCalculation) {
            editor.value?.chain().setNodeSelection(pos).updateInlineMath({ latex: newCalculation }).focus().run()
          }
        },
      },
    }),
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: mentionSuggestion,
    }),
    TaskList,
    CustomTaskItem.configure({
      nested: true,
    }),
    Youtube.configure({
      controls: false,
      nocookie: true,
    }),
    TextStyle,
    BackgroundColor,
    Color,
    FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: (currentEditor, files, pos) => {
        files.forEach((file) => {
          const fileReader = new FileReader()

          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run()
          }
        })
      },
      onPaste: (currentEditor, files) => {
        files.forEach((file) => {
          const fileReader = new FileReader()

          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run()
          }
        })
      },
    }),
    Gapcursor,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Typography,
    UndoRedo,
  ]
}
