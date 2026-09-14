# [notionuxt](https://notionuxt.vercel.app)

A modern, beautiful Notion-style rich text editor built with Nuxt.js on the Matra editor framework, with extensive formatting options.

![notionuxt Preview](https://img.shields.io/badge/Nuxt-4.2.1-00DC82?style=flat&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5.24-4FC08D?style=flat&logo=vue.js)
![Matra](https://img.shields.io/badge/Matra-1.x-000000?style=flat)
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

### Storage

- **Auto-save**: Content automatically saved to localStorage
- **Persistent State**: Content restored on page reload

### UI/UX

- **Modern Design**: Clean, minimal interface with shadcn-vue components
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Floating Toolbar**: Context-aware formatting toolbar

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nh-shohan/notionuxt.git
   cd notionuxt
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
notionuxt/
├── app/
│   ├── app.vue                 # Main application component
│   ├── assets/css/             # Stylesheets
│   │   ├── main.css           # Main Tailwind CSS
│   │   └── editor.css         # Editor-specific styles
│   ├── components/
│   │   ├── editor/            # Editor components
│   │   │   ├── Editor.vue     # Main editor component
│   │   │   ├── components/    # Editor sub-components
│   │   │   │   ├── FloatingToolbar.vue
│   │   │   │   ├── ColorPicker.vue
│   │   │   │   ├── EmojiList.vue
│   │   │   │   ├── MentionList.vue
│   │   │   │   ├── SlashCommandList.vue
│   │   │   │   └── TaskItemComponent.vue
│   │   │   ├── dialogs/       # Editor dialogs
│   │   │   ├── suggestions/   # Slash/mention/emoji popup watchers
│   │   │   └── suggestions/   # Suggestion systems
│   │   ├── ui/                # Reusable UI components (shadcn-vue)
│   │   └── ThemeToggler.vue   # Theme toggle component
│   ├── composables/           # Vue composables
│   │   ├── useEditor.ts       # Main editor logic
│   │   ├── useEditorActions.ts # Editor actions
│   │   ├── useEditorExtensions.ts # Matra extensions
│   │   ├── useEditorToolbar.ts # Toolbar logic
│   │   └── useBodyScrollLock.ts # Scroll lock utility
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── plugins/
│       └── ssr-width.ts       # SSR width plugin
├── components.json            # shadcn-vue configuration
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## 🛠 Tech Stack

### Core Framework

- **Nuxt 4** - Full-stack Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript

### Editor Engine

- **Matra 1** - Headless editor framework (`@matrajs/core` + `@matrajs/vue`)
- **ProseMirror** - Rich text editing engine

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn-vue** - Modern Vue component library
- **Lucide Icons** - Beautiful icon set
- **Reka UI** - Vue component library

### Development Tools

- **ESLint** - Code linting
- **Husky** - Git hooks
- **Vite** - Fast build tool

## 🎯 Usage

### Basic Editing

1. Start typing to create paragraphs
2. Use `/` to access slash commands for different content types
3. Select text and use the floating toolbar for formatting
4. Drag the handle (⠿) on the left to reorder blocks

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

### Collaborative Editing

Real-time collaboration is available through Matra's `@matrajs/collab` package (step exchange, rebasing and presence over any transport). It is not wired into this project by default.

## 🔧 Configuration

### Nuxt Configuration

Key settings in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  ssr: false, // Client-side only for editor functionality
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Editor Extensions

Customize editor features in `useEditorExtensions.ts`:

```typescript
export function createEditorExtensions(editor, lowlight) {
  return [
    // Core extensions
    Document,
    Paragraph,
    Text,
    // Add or remove extensions as needed
  ]
}
```

## 📱 Responsive Design

The editor is fully responsive and works on:

- **Desktop**: Full feature set with floating toolbar
- **Tablet**: Adapted touch interactions
- **Mobile**: Optimized mobile editing experience

## 🎨 Customization

### Themes

Toggle between light and dark themes using the theme toggler in the top-right corner.

### Styling

Customize appearance by modifying:

- `app/assets/css/main.css` - Main styles
- `app/assets/css/editor.css` - Editor-specific styles
- Tailwind configuration in `nuxt.config.ts`

### Components

Extend functionality by:

- Adding new Matra extensions
- Creating custom Vue components
- Modifying existing UI components

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues

# Setup
pnpm postinstall  # Run after installation (nuxt prepare)
```

### Adding New Features

1. Create a new Matra extension or Vue component
2. Add it to the appropriate directory
3. Import and configure in `useEditorExtensions.ts`
4. Update the slash commands if needed

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test thoroughly
4. **Run linting**: `pnpm lint:fix`
5. **Commit your changes**: `git commit -m 'Add some feature'`
6. **Push to the branch**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Guidelines

- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Nahim Hossain Shohan**

- GitHub: [@nh-shohan](https://github.com/nh-shohan)
- LinkedIn: [Nahim Hossain Shohan](https://www.linkedin.com/in/nahim-hossain-shohan/)

## 🙏 Acknowledgments

- [Matra](https://matrajs.com/) - The headless editor framework
- [Nuxt.js](https://nuxt.com/) - The Vue.js framework
- [shadcn-vue](https://www.shadcn-vue.com/) - Beautiful Vue UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 🔗 Links

- [Live Demo](https://notionuxt.vercel.app)
- [Issues](https://github.com/nh-shohan/notionuxt/issues)
- [Discussions](https://github.com/nh-shohan/notionuxt/discussions)

---

Made with ❤️ and lots of ☕
