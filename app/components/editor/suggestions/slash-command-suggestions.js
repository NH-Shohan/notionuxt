import { VueRenderer } from '@tiptap/vue-3'

import SlashCommandList from '@/components/editor/components/SlashCommandList.vue'

function getSuggestionItems() {
  return [
    // Basic blocks
    {
      id: 'text',
      title: 'Text',
      description: 'Start writing with plain text',
      icon: 'TypeIcon',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setParagraph().run()
      },
    },
    {
      id: 'heading1',
      title: 'Heading 1',
      description: 'Big section heading',
      icon: 'Heading1',
      shortcut: '#',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()
      },
    },
    {
      id: 'heading2',
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: 'Heading2',
      shortcut: '##',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run()
      },
    },
    {
      id: 'heading3',
      title: 'Heading 3',
      description: 'Small section heading',
      icon: 'Heading3',
      shortcut: '###',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run()
      },
    },
    {
      id: 'bulletList',
      title: 'Bulleted list',
      description: 'Create a simple bulleted list',
      icon: 'List',
      shortcut: '-',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    {
      id: 'numberedList',
      title: 'Numbered list',
      description: 'Create a list with numbering',
      icon: 'ListOrdered',
      shortcut: '1.',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
    },
    {
      id: 'taskList',
      title: 'To-do list',
      description: 'Track tasks with a to-do list',
      icon: 'ListChecks',
      shortcut: '[]',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run()
      },
    },
    {
      id: 'toggleList',
      title: 'Toggle list',
      description: 'Toggleable list of items',
      icon: 'ChevronRight',
      shortcut: '>',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setDetails().run()
      },
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a quote',
      icon: 'Quote',
      shortcut: '"',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run()
      },
    },
    {
      id: 'codeBlock',
      title: 'Code block',
      description: 'Insert a code block',
      icon: 'Code2',
      shortcut: '```',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
      },
    },
    {
      id: 'horizontalRule',
      title: 'Divider',
      description: 'Insert a horizontal divider',
      icon: 'Minus',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run()
      },
    },
    {
      id: 'image',
      title: 'Image',
      description: 'Insert an image',
      icon: 'Image',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const url = prompt('Enter image URL:', '') ?? ''
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Embed a YouTube video',
      icon: 'Youtube',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const url = prompt('Enter YouTube URL:', '') ?? ''
        if (url) {
          editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
      },
    },
    {
      id: 'inlineMath',
      title: 'Inline math',
      description: 'Insert inline math equation',
      icon: 'Sigma',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const latex = prompt('Enter inline math expression:', '') ?? ''
        if (latex) {
          editor.chain().focus().insertInlineMath({ latex }).run()
        }
      },
    },
    {
      id: 'blockMath',
      title: 'Block math',
      description: 'Insert block math equation',
      icon: 'SquareSigma',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const latex = prompt('Enter block math expression:', '') ?? ''
        if (latex) {
          editor.chain().focus().insertBlockMath({ latex }).run()
        }
      },
    },
  ]
}

export default {
  items: ({ query }) => {
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
  },

  render: () => {
    let component

    function repositionComponent(clientRect) {
      if (!component || !component.element) {
        return
      }

      // Set initial position immediately to avoid flickering
      const initialTop = clientRect.bottom + 16
      const initialLeft = clientRect.left
      Object.assign(component.element.style, {
        position: 'fixed',
        left: `${initialLeft}px`,
        top: `${initialTop}px`,
        zIndex: '50',
      })

      // Use requestAnimationFrame to ensure element is rendered and dimensions are accurate, then refine position
      requestAnimationFrame(() => {
        if (!component || !component.element) {
          return
        }

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const padding = 8 // Padding from viewport edges
        const gap = 16 // Gap between cursor and menu

        // Get actual menu dimensions
        const menuWidth = component.element.offsetWidth || 320
        const menuHeight = component.element.offsetHeight || 440

        // Calculate initial position (below cursor, aligned to left)
        let top = clientRect.bottom + gap
        let left = clientRect.left

        // Check if menu would go off the bottom
        if (top + menuHeight > viewportHeight - padding) {
          // Try to position above cursor
          const topPosition = clientRect.top - menuHeight - gap
          if (topPosition >= padding) {
            top = topPosition
          }
          else {
            // If can't fit above, position at bottom of viewport
            top = Math.max(padding, viewportHeight - menuHeight - padding)
          }
        }

        // Check if menu would go off the right
        if (left + menuWidth > viewportWidth - padding) {
          // Align to right edge of viewport
          left = viewportWidth - menuWidth - padding
        }

        // Check if menu would go off the left
        if (left < padding) {
          // Align to left edge of viewport
          left = padding
        }

        Object.assign(component.element.style, {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          zIndex: '50',
        })
      })
    }

    return {
      onStart: (props) => {
        component = new VueRenderer(SlashCommandList, {
          props,
          editor: props.editor,
        })

        document.body.appendChild(component.element)
        repositionComponent(props.clientRect())
      },

      onUpdate(props) {
        component.updateProps(props)
        repositionComponent(props.clientRect())
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          document.body.removeChild(component.element)
          component.destroy()
          component = null
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        if (component && document.body.contains(component.element)) {
          document.body.removeChild(component.element)
        }
        if (component) {
          component.destroy()
          component = null
        }
      },
    }
  },
}
