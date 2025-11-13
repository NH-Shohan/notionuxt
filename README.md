# notionuxt

A modern and beautiful Notion-style rich text editor for Vue 3 with collaborative features.

[![npm version](https://badge.fury.io/js/notionuxt.svg)](https://www.npmjs.com/package/notionuxt)
[![npm downloads](https://img.shields.io/npm/dm/notionuxt.svg)](https://www.npmjs.com/package/notionuxt)
![Vue](https://img.shields.io/badge/Vue-3.0+-4FC08D?style=flat&logo=vue.js)
![TipTap](https://img.shields.io/badge/TipTap-3.x-000000?style=flat)
![License](https://img.shields.io/badge/License-MIT-green.svg)
[![GitHub stars](https://img.shields.io/github/stars/nh-shohan/notionuxt.svg?style=social&label=Star)](https://github.com/nh-shohan/notionuxt)

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

- Nuxt 3.0+
- Node.js 16+

### Install the package

```bash
npm install notionuxt
# or
yarn add notionuxt
# or
pnpm add notionuxt
```

**That's it!** No additional dependencies required - everything is bundled.

📦 **Package**: [npmjs.com/package/notionuxt](https://www.npmjs.com/package/notionuxt)

### Tailwind CSS Configuration

The package automatically configures Tailwind CSS for you! Just use the provided helper:

#### For Tailwind CSS v3

Wrap your Tailwind config with the `withNotionUxt` helper:

```javascript
// tailwind.config.js
const { withNotionUxt } = require('notionuxt/lib/tailwind-config')

module.exports = withNotionUxt({
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    // notionuxt paths are automatically added!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
```

#### For Tailwind CSS v4

The `@source` directive is automatically included in the package styles. Just import the styles:

```css
@import 'tailwindcss';
@import 'notionuxt/styles';
/* notionuxt content paths are automatically included! */
```

## 📖 Usage

### Basic Setup

```vue
<script setup>
import { NotionEditor } from 'notionuxt'
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
import { NotionEditor } from 'notionuxt'

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
import { NotionEditor, useEditor } from 'notionuxt'
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
import 'notionuxt/styles'
```

### Custom Styling

You can customize the appearance by overriding CSS variables. **Important**: Define your custom CSS variables **after** importing `notionuxt/styles` to ensure they override the defaults:

```css
/* Import notionuxt styles first */
@import 'tailwindcss';
@import 'notionuxt/styles';

/* Then define your custom variables - they will override the defaults */
:root {
  --background: #ffffff;
  --foreground: #000000;
  --card: #ffffff;
  --card-foreground: #000000;
  --popover: #ffffff;
  --popover-foreground: #000000;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #000000;
  --accent: #f1f5f9;
  --accent-foreground: #000000;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #3b82f6;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --radius: 0.75rem;
}

/* Override dark mode variables */
.dark {
  --background: #1a1a1a;
  --foreground: #ffffff;
  --card: #1a1a1a;
  --card-foreground: #ffffff;
  --popover: #1a1a1a;
  --popover-foreground: #ffffff;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #2a2a2a;
  --secondary-foreground: #ffffff;
  --accent: #2a2a2a;
  --accent-foreground: #ffffff;
  --muted: #2a2a2a;
  --muted-foreground: #a0a0a0;
  --border: #3a3a3a;
  --input: #3a3a3a;
  --ring: #3b82f6;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
}

body {
  @apply bg-background text-foreground;
}
```

Alternatively, you can scope variables to a specific class:

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

The editor uses the following CSS variables for theming. Default values are defined in the `defaults` layer and can be overridden:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #3b82f6;
  --secondary: #f1f5f9;
  --border: #e2e8f0;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  --card: #ffffff;
  --card-foreground: #000000;
  --popover: #ffffff;
  --popover-foreground: #000000;
  --primary-foreground: #ffffff;
  --secondary-foreground: #000000;
  --accent: #f1f5f9;
  --accent-foreground: #000000;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --input: #e2e8f0;
  --ring: #3b82f6;
  --radius: 0.75rem;
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
} from 'notionuxt'

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
import { createEditorExtensions } from '@notion-vue/editor'
import { CustomExtension } from './my-extensions'

const editor = ref(null) // Initialize editor ref first
const lowlight = createLowlight(all)

const customExtensions = createEditorExtensions(editor, lowlight)
customExtensions.push(CustomExtension)

editor.value = new Editor({
  extensions: customExtensions,
  // ... other options
})
```

### Collaborative Editing

The editor supports real-time collaboration via Yjs:

```javascript
import { NotionEditor } from 'notionuxt'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

// Set up Yjs document
const ydoc = new Y.Doc()
const provider = new WebrtcProvider('notion-editor-room', ydoc)
```

Then use it in your Vue template:

```vue
<NotionEditor :options="{ ydoc }" />
```

## 📱 Responsive Design

The editor is fully responsive and optimized for:

- **Desktop**: Full feature set with floating toolbar
- **Tablet**: Adapted touch interactions
- **Mobile**: Optimized mobile editing experience

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test thoroughly
4. **Run linting**: `npm run lint:fix` or `pnpm lint:fix`
5. **Commit your changes**: `git commit -m 'Add some feature'`
6. **Push to the branch**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Guidelines

- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

For more details, see the [Contributing Guide](https://github.com/nh-shohan/notionuxt/blob/main/CONTRIBUTING.md) (if available).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Nahim Hossain Shohan**

- GitHub: [@nh-shohan](https://github.com/nh-shohan)
- LinkedIn: [Nahim Hossain Shohan](https://www.linkedin.com/in/nahim-hossain-shohan/)

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) - The headless editor framework
- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Yjs](https://yjs.dev/) - Real-time collaboration framework
- [Nuxt.js](https://nuxt.com/) - The Vue.js framework
- [shadcn-vue](https://www.shadcn-vue.com/) - Beautiful Vue UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 🔗 Links

- 📦 [npm Package](https://www.npmjs.com/package/notionuxt)
- 🌐 [Live Demo](https://notionuxt.vercel.app)
- 📚 [GitHub Repository](https://github.com/nh-shohan/notionuxt)
- 🐛 [Report Issues](https://github.com/nh-shohan/notionuxt/issues)
- 💬 [Discussions](https://github.com/nh-shohan/notionuxt/discussions)
- 📖 [Documentation](https://github.com/nh-shohan/notionuxt#readme)

---

Made with ❤️ and lots of ☕
