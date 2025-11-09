<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading';
import type { Editor as EditorType } from '@tiptap/vue-3';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import Document from '@tiptap/extension-document';
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import { Mathematics, migrateMathStrings } from '@tiptap/extension-mathematics';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Youtube from '@tiptap/extension-youtube';
import { Dropcursor, Placeholder } from '@tiptap/extensions';
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';
import {
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  SigmaIcon,
  SquareSigma,
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
    icon: Code,
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

  <div class="border rounded-lg p-4 mt-5">
    <EditorContent :editor="editor as Editor" />
  </div>
</template>
