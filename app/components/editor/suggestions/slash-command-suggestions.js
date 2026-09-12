import { activeSuggestion } from '@matrajs/core'

import SlashCommandList from '@/components/editor/components/SlashCommandList.vue'
import { lockBodyScroll, unlockBodyScroll } from '@/composables/useBodyScrollLock'
import { createPopupRenderer, positionPopup, suggestionAnchorRect } from './renderer'

const SUGGESTION_NAME = 'slashCommand'
const DECORATION_CLASS = 'matra-suggestion-slash'

function getSuggestionItems() {
  return [
    // Basic blocks
    {
      id: 'text',
      title: 'Paragraph',
      description: 'Start writing with plain text',
      icon: 'TypeIcon',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.setParagraph()
        })
      },
    },
    {
      id: 'heading1',
      title: 'Heading 1',
      description: 'Big section heading',
      icon: 'Heading1',
      shortcut: '#',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleHeading(1)
        })
      },
    },
    {
      id: 'heading2',
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: 'Heading2',
      shortcut: '##',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleHeading(2)
        })
      },
    },
    {
      id: 'heading3',
      title: 'Heading 3',
      description: 'Small section heading',
      icon: 'Heading3',
      shortcut: '###',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleHeading(3)
        })
      },
    },
    {
      id: 'bulletList',
      title: 'Bulleted list',
      description: 'Create a simple bulleted list',
      icon: 'List',
      shortcut: '-',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleBulletList()
        })
      },
    },
    {
      id: 'numberedList',
      title: 'Numbered list',
      description: 'Create a list with numbering',
      icon: 'ListOrdered',
      shortcut: '1.',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleOrderedList()
        })
      },
    },
    {
      id: 'taskList',
      title: 'To-do list',
      description: 'Track tasks with a to-do list',
      icon: 'ListChecks',
      shortcut: '[]',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleTaskList()
        })
      },
    },
    {
      id: 'toggleList',
      title: 'Toggle list',
      description: 'Toggleable list of items',
      icon: 'ChevronRight',
      shortcut: '>',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.insertDetails()
        })
      },
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a quote',
      icon: 'Quote',
      shortcut: '"',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleBlockquote()
        })
      },
    },
    {
      id: 'codeBlock',
      title: 'Code block',
      description: 'Insert a code block',
      icon: 'Code2',
      shortcut: '```',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.toggleCodeBlock()
        })
      },
    },
    {
      id: 'horizontalRule',
      title: 'Divider',
      description: 'Insert a horizontal divider',
      icon: 'Minus',
      command: ({ editor, range }) => {
        editor.batch((c) => {
          c.focus()
          if (range) {
            c.remove(range)
          }
          c.insertHorizontalRule()
        })
      },
    },
    {
      id: 'image',
      title: 'Image',
      description: 'Insert an image',
      icon: 'Image',
      command: () => {
        // Dialog will be handled by SlashCommandList
      },
    },
    {
      id: 'video',
      title: 'Youtube',
      description: 'Embed a YouTube video',
      icon: 'Youtube',
      command: () => {
        // Dialog will be handled by SlashCommandList
      },
    },
    {
      id: 'inlineMath',
      title: 'Inline math',
      description: 'Insert inline math equation',
      icon: 'Sigma',
      command: () => {
        // Dialog will be handled by SlashCommandList
      },
    },
    {
      id: 'blockMath',
      title: 'Block math',
      description: 'Insert block math equation',
      icon: 'SquareSigma',
      command: () => {
        // Dialog will be handled by SlashCommandList
      },
    },
  ]
}

function filterItems(query) {
  const items = getSuggestionItems()
  if (!query) {
    return items
  }
  const lowerQuery = query.toLowerCase()
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerQuery)
    || item.description?.toLowerCase().includes(lowerQuery)
    || item.shortcut?.toLowerCase().includes(lowerQuery),
  )
}

/**
 * Owns the slash-command menu for one editor: watches Matra's headless
 * suggestion state, renders SlashCommandList next to the trigger, and routes
 * keyboard navigation into it. Returns a teardown function.
 */
export function watchSlashCommands(editor) {
  let component = null

  function hide() {
    if (!component) {
      return
    }
    if (document.body.contains(component.element)) {
      document.body.removeChild(component.element)
    }
    component.destroy()
    component = null
    unlockBodyScroll()
  }

  function executeItem(item) {
    const active = activeSuggestion(editor, SUGGESTION_NAME)
    const range = active?.range ?? null
    hide()
    item.command({ editor, range })
  }

  function sync() {
    const active = activeSuggestion(editor, SUGGESTION_NAME)
    if (!active) {
      // Deferred so a command that clears the suggestion state does not tear
      // the list down while one of its own methods is still running.
      queueMicrotask(() => {
        if (!activeSuggestion(editor, SUGGESTION_NAME)) {
          hide()
        }
      })
      return
    }

    const items = filterItems(active.query)
    const props = {
      items,
      command: executeItem,
      editor,
      query: active.query,
      range: active.range,
    }

    if (!component) {
      component = createPopupRenderer(SlashCommandList, props)
      document.body.appendChild(component.element)
      lockBodyScroll()
    }
    else {
      component.updateProps(props)
    }

    positionPopup(component.element, suggestionAnchorRect(DECORATION_CLASS), { gap: 16 })
  }

  function onKeyDown(event) {
    if (!component) {
      return
    }
    // Keys typed into dialogs or other UI belong to that UI, not the menu
    const target = event.target
    if (target instanceof Element && !target.closest('.matra-editor')) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      editor.commands.cancelSlashCommand()
      hide()
      editor.commands.focus()
      return
    }

    const handled = component.ref?.onKeyDown?.({ event })
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const offChange = editor.on('change', sync)
  const offSelection = editor.on('selectionChange', sync)
  // Captured, so the menu gets Enter before the editor splits the block with it
  document.addEventListener('keydown', onKeyDown, true)

  return () => {
    document.removeEventListener('keydown', onKeyDown, true)
    offChange()
    offSelection()
    hide()
  }
}
