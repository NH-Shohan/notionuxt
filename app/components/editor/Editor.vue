<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading';
import type { Editor as EditorType } from '@tiptap/vue-3';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import Document from '@tiptap/extension-document';
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3';
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji';
import FileHandler from '@tiptap/extension-file-handler';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import { Mathematics, migrateMathStrings } from '@tiptap/extension-mathematics';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { BackgroundColor, Color, TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Dropcursor, Gapcursor, Placeholder, UndoRedo } from '@tiptap/extensions';
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BrushIcon,
  ChevronDown,
  Code2Icon,
  CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  PaintbrushIcon,
  Quote,
  SigmaIcon,
  SquareSigma,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TextInitialIcon,
  UnderlineIcon,
  YoutubeIcon,
} from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import mention from './mention.js';
import suggestion from './suggestion.js';
import TaskItemComponent from './TaskItemComponent.vue';
import 'katex/dist/katex.min.css';

const editor = ref<EditorType | null>(null);
const isEditable = ref(true);
const lowlight = createLowlight(all);

lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

function toggleBold() {
  if (editor.value) {
    editor.value?.chain().focus().toggleBold().run();
  }
}

function toggleItalic() {
  if (editor.value) {
    editor.value?.chain().focus().toggleItalic().run();
  }
}

function toggleStrike() {
  if (editor.value) {
    editor.value?.chain().focus().toggleStrike().run();
  }
}

function toggleUnderline() {
  if (editor.value) {
    editor.value?.chain().focus().toggleUnderline().run();
  }
}

function toggleLink() {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = prompt('URL', previousUrl) ?? '';

  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }
}

function toggleCode() {
  if (editor.value) {
    editor.value?.chain().focus().toggleCode().run();
  }
}

function toggleHighlight() {
  if (editor.value) {
    editor.value?.chain().focus().toggleHighlight().run();
  }
}

function toggleSuperscript() {
  if (editor.value) {
    editor.value?.chain().focus().toggleSuperscript().run();
  }
}

function toggleSubscript() {
  if (editor.value) {
    editor.value?.chain().focus().toggleSubscript().run();
  }
}

function toggleBlockquote() {
  if (editor.value) {
    editor.value?.chain().focus().toggleBlockquote().run();
  }
}

function toggleBulletList() {
  if (editor.value) {
    editor.value?.chain().focus().toggleBulletList().run();
  }
}

function toggleOrderedList() {
  if (editor.value) {
    editor.value?.chain().focus().toggleOrderedList().run();
  }
}

function toggleCodeBlock() {
  if (editor.value) {
    editor.value?.chain().focus().toggleCodeBlock().run();
  }
}

function setDetails() {
  if (editor.value) {
    editor.value?.chain().focus().setDetails().run();
  }
}

function unsetDetails() {
  if (editor.value) {
    editor.value?.chain().focus().unsetDetails().run();
  }
}

function toggleDetails() {
  if (editor.value) {
    if (editor.value?.isActive('details')) {
      unsetDetails();
    } else {
      setDetails();
    }
  }
}

function toggleHeading(level: Level) {
  if (editor.value) {
    editor.value?.chain().focus().toggleHeading({ level }).run();
  }
}

function setParagraph() {
  if (editor.value) {
    editor.value?.chain().focus().setParagraph().run();
  }
}

function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
  if (editor.value) {
    editor.value?.chain().focus().setTextAlign(align).run();
  }
}

function setHorizontalRule() {
  if (editor.value) {
    editor.value?.chain().focus().setHorizontalRule().run();
  }
}

function addImage() {
  const url = prompt('URL') ?? '';

  if (url) {
    if (editor.value) {
      editor.value?.chain().focus().setImage({ src: url }).run();
    }
  }
}

function onInsertInlineMath() {
  const hasSelection = !editor.value?.state.selection.empty;
  if (hasSelection) {
    return editor.value?.chain().focus().insertInlineMath({ latex: '' }).run();
  }

  const latex = prompt('Enter inline math expression:', '') ?? '';
  if (latex) {
    return editor.value?.chain().focus().insertInlineMath({ latex }).run();
  }
}

function onInsertBlockMath() {
  const hasSelection = !editor.value?.state.selection.empty;
  if (hasSelection) {
    return editor.value?.chain().focus().insertBlockMath({ latex: '' }).run();
  }

  const latex = prompt('Enter block math expression:', '') ?? '';
  if (latex) {
    return editor.value?.chain().focus().insertBlockMath({ latex }).run();
  }
}

function toggleTaskList() {
  if (editor.value) {
    editor.value?.chain().focus().toggleTaskList().run();
  }
}

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return VueNodeViewRenderer(TaskItemComponent);
  },
});

function addVideo() {
  const url = prompt('Enter YouTube URL:', '') ?? '';

  if (url && editor.value) {
    editor.value
      ?.chain()
      .focus()
      .setYoutubeVideo({
        src: url,
      })
      .run();
  }
}

function toggleBackgroundColor() {
  if (editor.value) {
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.value?.chain().focus().setBackgroundColor('#faf594').run();
    }
  }
}

function toggleTextColor() {
  if (editor.value) {
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetColor().run();
    } else {
      editor.value?.chain().focus().setColor('#f00').run();
    }
  }
}

function _toggleEditing() {
  isEditable.value = !isEditable.value;

  if (editor.value) {
    editor.value.setEditable(isEditable.value as boolean);
  }
}

function _sinkListItem() {
  if (editor.value) {
    editor.value?.chain().focus().sinkListItem('listItem').run();
  }
}

function _liftListItem() {
  if (editor.value) {
    editor.value?.chain().focus().liftListItem('listItem').run();
  }
}

onMounted(() => {
  editor.value = new Editor({
    content: '',
    extensions: [
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
        suggestion,
      }),
      Mathematics.configure({
        blockOptions: {
          onClick: (node, pos) => {
            const newCalculation = prompt('Enter new calculation:', node.attrs.latex);
            if (newCalculation) {
              editor.value?.chain().setNodeSelection(pos).updateBlockMath({ latex: newCalculation }).focus().run();
            }
          },
        },
        inlineOptions: {
          onClick: (node, pos) => {
            const newCalculation = prompt('Enter new calculation:', node.attrs.latex);
            if (newCalculation) {
              editor.value?.chain().setNodeSelection(pos).updateInlineMath({ latex: newCalculation }).focus().run();
            }
          },
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: mention,
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
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
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
                .run();
            };
          });
        },
        onPaste: (currentEditor, files) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
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
                .run();
            };
          });
        },
      }),
      Gapcursor,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      UndoRedo,
    ],
    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor);
    },
    autofocus: true,
    editable: true,
    injectCSS: true,
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const actions = [
  {
    icon: Heading1,
    action: () => toggleHeading(1),
  },
  {
    icon: Heading2,
    action: () => toggleHeading(2),
  },
  {
    icon: Heading3,
    action: () => toggleHeading(3),
  },
  {
    icon: TextInitialIcon,
    action: setParagraph,
  },
  {
    icon: AlignLeftIcon,
    action: () => setTextAlign('left'),
  },
  {
    icon: AlignCenterIcon,
    action: () => setTextAlign('center'),
  },
  {
    icon: AlignRightIcon,
    action: () => setTextAlign('right'),
  },
  {
    icon: AlignJustifyIcon,
    action: () => setTextAlign('justify'),
  },
  {
    icon: BoldIcon,
    action: toggleBold,
  },
  {
    icon: ItalicIcon,
    action: toggleItalic,
  },
  {
    icon: StrikethroughIcon,
    action: toggleStrike,
  },
  {
    icon: UnderlineIcon,
    action: toggleUnderline,
  },
  {
    icon: Link2Icon,
    action: toggleLink,
  },
  {
    icon: CodeIcon,
    action: toggleCode,
  },
  {
    icon: HighlighterIcon,
    action: toggleHighlight,
  },
  {
    icon: SuperscriptIcon,
    action: toggleSuperscript,
  },
  {
    icon: SubscriptIcon,
    action: toggleSubscript,
  },
  {
    icon: Quote,
    action: toggleBlockquote,
  },
  {
    icon: List,
    action: toggleBulletList,
  },
  {
    icon: ListOrdered,
    action: toggleOrderedList,
  },
  {
    icon: Code2Icon,
    action: toggleCodeBlock,
  },
  {
    icon: ChevronDown,
    action: toggleDetails,
  },
  {
    icon: Minus,
    action: setHorizontalRule,
  },
  {
    icon: ImageIcon,
    action: addImage,
  },
  {
    icon: SigmaIcon,
    action: onInsertInlineMath,
  },
  {
    icon: SquareSigma,
    action: onInsertBlockMath,
  },
  {
    icon: ListChecks,
    action: toggleTaskList,
  },
  {
    icon: YoutubeIcon,
    action: addVideo,
  },
  {
    icon: PaintbrushIcon,
    action: toggleBackgroundColor,
  },
  {
    icon: BrushIcon,
    action: toggleTextColor,
  },
];
</script>

<template>
  <div class="space-x-2 space-y-2">
    <UiButton
      v-for="action in actions"
      :key="action.icon.name"
      variant="outline"
      size="icon"
      @click="action.action"
    >
      <component :is="action.icon" />
    </UiButton>
  </div>

  <div class="border rounded-lg p-4 mt-5 pl-6 relative">
    <DragHandle
      v-if="editor"
      :editor="editor"
      :compute-position-config="{ placement: 'left-start', strategy: 'absolute' }"
    >
      <div class="drag-handle-icon">⠿</div>
    </DragHandle>
    <EditorContent :editor="editor as Editor" />
  </div>
</template>
