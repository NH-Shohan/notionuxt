# @notion-vue/editor

A modern and beautiful Notion-style rich text editor for Vue 3 with collaborative features.

[![npm version](https://badge.fury.io/js/%40notion-vue%2Feditor.svg)](https://badge.fury.io/js/%40notion-vue%2Feditor)
![Vue](https://img.shields.io/badge/Vue-3.0+-4FC08D?style=flat&logo=vue.js)
![TipTap](https://img.shields.io/badge/TipTap-3.x-000000?style=flat)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### Rich Text Editing

- **Headings** (H1, H2, H3) with proper hierarchy
- **Text Formatting**: Bold, italic, underline, strikethrough, highlight, superscript, subscript
- **Lists**: Bullet lists, numbered lists, and nested task lists with checkboxes
- **Code Blocks**: Syntax highlighting for multiple languages (JavaScript, TypeScript, HTML, CSS)
- **Blockquotes** and horizontal rules
- **Text Alignment**: Left, center, right, justify
- **Typography**: Smart quotes, dashes, and ellipses

### Media & Embeds

- **Image Upload**: Drag & drop or paste images with resize capabilities
- **YouTube Embeds**: Embed videos with customizable controls
- **File Handling**: Support for PNG, JPEG, GIF, and WebP images

### Interactive Elements

- **Mentions**: @mention system with suggestions
- **Emojis**: GitHub emoji picker with emoticon support
- **Slash Commands**: Quick access to all editor features via `/` commands
- **Collapsible Details**: Expandable content sections
- **Mathematics**: LaTeX math expressions (inline and block)
- **Drag & Drop**: Reorder content blocks with drag handles

### Collaboration & Storage

- **Real-time Collaboration**: Powered by Yjs for multi-user editing
- **Auto-save**: Content automatically saved to localStorage
- **Persistent State**: Content restored on page reload

### UI/UX

- **Modern Design**: Clean, minimal interface
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Floating Toolbar**: Context-aware formatting toolbar

## 🚀 Installation

### Prerequisites

- Vue 3.0+
- Node.js 16+

### Install the package

```bash
npm install @notion-vue/editor
# or
yarn add @notion-vue/editor
# or
pnpm add @notion-vue/editor
```

### Peer Dependencies

Make sure you have Vue 3 installed in your project:

```bash
npm install vue@^3.0.0
```

## 📖 Usage

### Basic Setup

```vue
<script setup>
import { NotionEditor } from '@notion-vue/editor'
// Styles are automatically imported
</script>

<template>
  <div>
    <NotionEditor />
  </div>
</template>
```

### With Options

```vue
<script setup>
import { NotionEditor } from '@notion-vue/editor'

const editorOptions = {
  content: '<p>Start writing...</p>',
  editable: true,
  autofocus: true,
  placeholder: 'Type something...'
}
</script>

<template>
  <div>
    <NotionEditor
      :options="editorOptions"
      class="my-custom-editor"
    />
  </div>
</template>
```

### Advanced Usage with Composables

```vue
<script setup>
import { NotionEditor, useEditor } from '@notion-vue/editor'
import { ref } from 'vue'

const editorRef = ref()
const { editor } = useEditor({
  content: '<p>Hello World!</p>',
  editable: true
})

function getContent() {
  if (editor.value) {
    console.log(editor.value.getHTML())
  }
}

function setContent() {
  if (editor.value) {
    editor.value.commands.setContent('<p>New content!</p>')
  }
}
</script>

<template>
  <div>
    <NotionEditor ref="editorRef" />
    <button @click="getContent">
      Get Content
    </button>
    <button @click="setContent">
      Set Content
    </button>
  </div>
</template>
```

## 🎨 Styling

### Default Styles

The package includes default styles that work out of the box. For full functionality, make sure to import the styles:

```javascript
import '@notion-vue/editor/styles'
```

### Custom Styling

You can customize the appearance by overriding CSS variables or adding custom classes:

```vue
<template>
  <NotionEditor class="my-editor" />
</template>

<style>
.my-editor {
  --background: #ffffff;
  --foreground: #000000;
  /* Add more custom variables */
}
</style>
```

### CSS Variables

The editor uses the following CSS variables for theming:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #3b82f6;
  --secondary: #f1f5f9;
  --border: #e2e8f0;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  /* ... and more */
}
```

## ⚙️ Configuration

### Editor Options

```typescript
interface EditorOptions {
  content?: string // Initial HTML content
  editable?: boolean // Whether the editor is editable (default: true)
  autofocus?: boolean // Auto-focus on mount (default: true)
  placeholder?: string // Placeholder text
}
```

### Using Composables

```javascript
import {
  createEditorExtensions,
  useEditor,
  useEditorActions
} from '@notion-vue/editor'

// Create a custom editor instance
const { editor } = useEditor({
  content: '<p>Custom content</p>',
  editable: true
})

// Access editor actions
const { toggleBold, toggleItalic } = useEditorActions(editor)

// Create custom extensions
const extensions = createEditorExtensions(editor, lowlight)
```

## 🎯 Features & Shortcuts

### Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- `Ctrl/Cmd + Shift + X` - Strikethrough
- `Ctrl/Cmd + Shift + 7` - Numbered list
- `Ctrl/Cmd + Shift + 8` - Bullet list
- `Ctrl/Cmd + Shift + 9` - Blockquote

### Slash Commands

Type `/` followed by:

- `/h1`, `/h2`, `/h3` - Headings
- `/code` - Code block
- `/image` - Image upload
- `/youtube` - YouTube embed
- `/math` - Math expression
- `/todo` - Task list
- `/quote` - Blockquote
- `/divider` - Horizontal rule

## 🔧 Advanced Configuration

### Custom Extensions

```javascript
import { createEditorExtensions, NotionEditor } from '@notion-vue/editor'
import { CustomExtension } from './my-extensions'

const customExtensions = createEditorExtensions(editor, lowlight)
customExtensions.push(CustomExtension)

const editor = new Editor({
  extensions: customExtensions,
  // ... other options
})
```

### Collaborative Editing

The editor supports real-time collaboration via Yjs:

```javascript
import { NotionEditor } from '@notion-vue/editor'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

// Set up Yjs document
const ydoc = new Y.Doc()
const provider = new WebrtcProvider('notion-editor-room', ydoc)

// Use in editor
<NotionEditor :options="{ ydoc }" />
```

## 📱 Responsive Design

The editor is fully responsive and optimized for:

- **Desktop**: Full feature set with floating toolbar
- **Tablet**: Adapted touch interactions
- **Mobile**: Optimized mobile editing experience

## 🤝 Contributing

We welcome contributions! Please see the main repository for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) - The headless editor framework
- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Yjs](https://yjs.dev/) - Real-time collaboration framework

## 🔗 Links

- [GitHub Repository](https://github.com/your-repo/notion-vue)
- [Issues](https://github.com/your-repo/notion-vue/issues)
- [Discussions](https://github.com/your-repo/notion-vue/discussions)
