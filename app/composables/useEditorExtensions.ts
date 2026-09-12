import type { CodeToken } from '@matrajs/core'
import type { createLowlight } from 'lowlight'
import {
  blockquote,
  bold,
  bulletList,
  code,
  codeBlock,
  codeHighlight,
  detailsCSS,
  detailsKit,
  document as documentNode,
  dragHandle,
  dragHandleCSS,
  emoji,
  fileHandler,
  heading,
  highlight,
  history,
  horizontalRule,
  image,
  imageResize,
  imageResizeCSS,
  italic,
  link,
  listItem,
  mathCSS,
  mathKit,
  mention,
  orderedList,
  paragraph,
  placeholder,
  placeholderCSS,
  strike,
  subscript,
  suggestion,
  suggestionCSS,
  superscript,
  taskItem,
  taskList,
  taskListCSS,
  text,
  textAlign,
  textStyle,
  trailingNode,
  typography,
  underline,
  youtube,
  youtubeCSS,
} from '@matrajs/core'
import katex from 'katex'

type Lowlight = ReturnType<typeof createLowlight>

interface HastNode {
  type: string
  value?: string
  properties?: { className?: string[] }
  children?: HastNode[]
}

// Adapts lowlight's hast output to Matra's CodeToken shape. Tokens keep the
// hljs-* class names, so the existing highlight theme applies unchanged.
function lowlightHighlighter(lowlight: Lowlight) {
  return (source: string, language: string | null): CodeToken[] => {
    const tokens: CodeToken[] = []
    let tree: { children: HastNode[] }
    try {
      tree = lowlight.highlight(language || 'javascript', source) as unknown as { children: HastNode[] }
    }
    catch {
      try {
        tree = lowlight.highlight('javascript', source) as unknown as { children: HastNode[] }
      }
      catch {
        return []
      }
    }

    let offset = 0
    const walk = (nodes: HastNode[], classes: string[]) => {
      for (const node of nodes) {
        if (node.type === 'text' && typeof node.value === 'string') {
          const length = node.value.length
          if (classes.length > 0) {
            tokens.push({ from: offset, to: offset + length, class: classes.join(' ') })
          }
          offset += length
        }
        else if (node.children) {
          walk(node.children, [...classes, ...(node.properties?.className ?? [])])
        }
      }
    }
    walk(tree.children, [])
    return tokens
  }
}

function readFileAsImage(file: File, insert: (src: string) => void) {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = () => {
    if (typeof fileReader.result === 'string') {
      insert(fileReader.result)
    }
  }
}

export function createEditorExtensions(lowlight: Lowlight) {
  return [
    documentNode,
    paragraph,
    text,
    heading,
    bold,
    italic,
    strike,
    underline,
    link,
    code,
    highlight,
    superscript,
    subscript,
    blockquote,
    bulletList,
    orderedList,
    listItem,
    codeBlock,
    codeHighlight({ highlight: lowlightHighlighter(lowlight) }),
    ...detailsKit,
    placeholder({
      text: 'Press "/" to start...',
      everyBlock: true,
    }),
    suggestion({ char: '/', name: 'slashCommand', decorationClass: 'matra-suggestion-slash' }),
    suggestion({ char: '@', name: 'mentionPicker', decorationClass: 'matra-suggestion-mention' }),
    suggestion({ char: ':', name: 'emojiPicker', decorationClass: 'matra-suggestion-emoji' }),
    horizontalRule,
    image,
    imageResize({ min: 200 }),
    emoji({ emoticons: true }),
    ...mathKit({
      render: (latex, element, display) => {
        katex.render(latex, element, { displayMode: display, throwOnError: false })
      },
    }),
    mention(),
    taskList,
    taskItem,
    youtube,
    textStyle,
    fileHandler({
      accept: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: ({ editor: currentEditor, files, pos, marker }) => {
        files.forEach((file) => {
          readFileAsImage(file, (src) => {
            currentEditor.commands.insert(
              { type: 'image', attrs: { src } },
              pos === null ? undefined : marker.map(pos),
            )
            currentEditor.commands.focus()
          })
        })
      },
      onPaste: ({ editor: currentEditor, files }) => {
        files.forEach((file) => {
          readFileAsImage(file, (src) => {
            currentEditor.commands.insert({ type: 'image', attrs: { src } })
            currentEditor.commands.focus()
          })
        })
      },
    }),
    textAlign(['heading', 'paragraph']),
    typography,
    history,
    trailingNode(),
    dragHandle({
      render: () => {
        const handle = document.createElement('div')
        handle.className = 'drag-handle-icon'
        handle.textContent = '⠿'
        return handle
      },
    }),
  ] as const
}

// The stylesheet strings Matra extensions ship. Injected once at editor
// creation, mirroring Tiptap's injectCSS behaviour.
const MATRA_STYLE_ID = 'notionuxt-matra-styles'

export function injectEditorStyles() {
  if (typeof document === 'undefined')
    return
  if (document.getElementById(MATRA_STYLE_ID))
    return

  const style = document.createElement('style')
  style.id = MATRA_STYLE_ID
  style.textContent = [
    dragHandleCSS,
    taskListCSS,
    detailsCSS,
    mathCSS,
    youtubeCSS,
    placeholderCSS,
    imageResizeCSS,
    suggestionCSS,
  ].join('\n')
  document.head.appendChild(style)
}
