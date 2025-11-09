import type { Level } from '@tiptap/extension-heading';
import type { Editor as EditorType } from '@tiptap/vue-3';
import type { Ref } from 'vue';

export function useEditorActions(editor: Ref<EditorType | null>) {
  function toggleBold() {
    editor.value?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.value?.chain().focus().toggleItalic().run();
  }

  function toggleStrike() {
    editor.value?.chain().focus().toggleStrike().run();
  }

  function toggleUnderline() {
    editor.value?.chain().focus().toggleUnderline().run();
  }

  function toggleLink() {
    const previousUrl = editor.value?.getAttributes('link').href;
    const url = prompt('URL', previousUrl) ?? '';

    if (url) {
      editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    }
  }

  function toggleCode() {
    editor.value?.chain().focus().toggleCode().run();
  }

  function toggleHighlight() {
    editor.value?.chain().focus().toggleHighlight().run();
  }

  function toggleSuperscript() {
    editor.value?.chain().focus().toggleSuperscript().run();
  }

  function toggleSubscript() {
    editor.value?.chain().focus().toggleSubscript().run();
  }

  function toggleBlockquote() {
    editor.value?.chain().focus().toggleBlockquote().run();
  }

  function toggleBulletList() {
    editor.value?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.value?.chain().focus().toggleOrderedList().run();
  }

  function toggleCodeBlock() {
    editor.value?.chain().focus().toggleCodeBlock().run();
  }

  function setDetails() {
    editor.value?.chain().focus().setDetails().run();
  }

  function unsetDetails() {
    editor.value?.chain().focus().unsetDetails().run();
  }

  function toggleDetails() {
    if (editor.value?.isActive('details')) {
      unsetDetails();
    } else {
      setDetails();
    }
  }

  function toggleHeading(level: Level) {
    editor.value?.chain().focus().toggleHeading({ level }).run();
  }

  function setParagraph() {
    editor.value?.chain().focus().setParagraph().run();
  }

  function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
    editor.value?.chain().focus().setTextAlign(align).run();
  }

  function setHorizontalRule() {
    editor.value?.chain().focus().setHorizontalRule().run();
  }

  function addImage() {
    const url = prompt('URL') ?? '';

    if (url) {
      editor.value?.chain().focus().setImage({ src: url }).run();
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
    editor.value?.chain().focus().toggleTaskList().run();
  }

  function addVideo() {
    const url = prompt('Enter YouTube URL:', '') ?? '';

    if (url) {
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
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.value?.chain().focus().setBackgroundColor('#faf594').run();
    }
  }

  function toggleTextColor() {
    if (editor.value?.isActive('textStyle')) {
      editor.value?.chain().focus().unsetColor().run();
    } else {
      editor.value?.chain().focus().setColor('#f00').run();
    }
  }

  return {
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleUnderline,
    toggleLink,
    toggleCode,
    toggleHighlight,
    toggleSuperscript,
    toggleSubscript,
    toggleBlockquote,
    toggleBulletList,
    toggleOrderedList,
    toggleCodeBlock,
    toggleDetails,
    toggleHeading,
    setParagraph,
    setTextAlign,
    setHorizontalRule,
    addImage,
    onInsertInlineMath,
    onInsertBlockMath,
    toggleTaskList,
    addVideo,
    toggleBackgroundColor,
    toggleTextColor,
  };
}
