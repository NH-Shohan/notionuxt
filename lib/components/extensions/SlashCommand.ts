import type { SuggestionOptions } from '@tiptap/suggestion'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import slashCommand from '../suggestions/slash-command-suggestions.js'

export interface SlashCommandOptions {
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export default Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props: item }) => {
          item.command({ editor, range })
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const isInTopLevel = $from.parent.type.name === 'doc' || $from.depth === 1
          const isInParagraph = $from.parent.type.name === 'paragraph'
          return isInTopLevel && isInParagraph
        },
        items: slashCommand.items,
        render: slashCommand.render,
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
