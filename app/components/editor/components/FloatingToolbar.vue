<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  HighlighterIcon,
  ItalicIcon,
  Link2Icon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BackgroundColorPicker from '@/components/editor/components/BackgroundColorPicker.vue'
import TextColorPicker from '@/components/editor/components/TextColorPicker.vue'
import LinkDialog from '@/components/editor/dialogs/LinkDialog.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  editor: EditorType
}>()

const editorActions = useEditorActions(computed(() => props.editor))

const show = ref(false)
const position = ref({ top: 0, left: 0 })
const linkDialogOpen = ref(false)

function updatePosition() {
  const { state, view } = props.editor
  const { selection } = state
  const { from, to } = selection

  if (from === to) {
    show.value = false
    return
  }

  // Get the coordinates of the selection
  const start = view.coordsAtPos(from)
  const end = view.coordsAtPos(to)

  // Calculate the center of the selection
  const centerX = (start.left + end.left) / 2
  const centerY = Math.min(start.top, end.top)

  // Position toolbar above the selection using fixed positioning (relative to viewport)
  position.value = {
    top: centerY - 46,
    left: centerX,
  }

  show.value = true
}

function handleSelectionUpdate() {
  updatePosition()
}

function handleUpdate() {
  updatePosition()
}

onMounted(() => {
  if (props.editor) {
    props.editor.on('selectionUpdate', handleSelectionUpdate)
    props.editor.on('update', handleUpdate)
    // Initial check for existing selection
    updatePosition()
  }
})

onBeforeUnmount(() => {
  if (props.editor) {
    props.editor.off('selectionUpdate', handleSelectionUpdate)
    props.editor.off('update', handleUpdate)
  }
})

const isBold = computed(() => props.editor.isActive('bold'))
const isItalic = computed(() => props.editor.isActive('italic'))
const isUnderline = computed(() => props.editor.isActive('underline'))
const isStrikethrough = computed(() => props.editor.isActive('strike'))
const isCode = computed(() => props.editor.isActive('code'))
const isHighlight = computed(() => props.editor.isActive('highlight'))
const isSuperscript = computed(() => props.editor.isActive('superscript'))
const isSubscript = computed(() => props.editor.isActive('subscript'))
const isAlignLeft = computed(() => props.editor.isActive({ textAlign: 'left' }))
const isAlignCenter = computed(() => props.editor.isActive({ textAlign: 'center' }))
const isAlignRight = computed(() => props.editor.isActive({ textAlign: 'right' }))
const isAlignJustify = computed(() => props.editor.isActive({ textAlign: 'justify' }))

function handleLinkClick() {
  linkDialogOpen.value = true
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed z-50 flex items-center gap-1 rounded-lg border bg-background px-2 py-1 shadow-lg"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-20%)',
      }"
    >
      <!-- Text Formatting -->
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isBold }"
        @click="editorActions.toggleBold"
      >
        <BoldIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isItalic }"
        @click="editorActions.toggleItalic"
      >
        <ItalicIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isUnderline }"
        @click="editorActions.toggleUnderline"
      >
        <UnderlineIcon class="h-4 w-4" />
      </Button>

      <Separator
        orientation="vertical"
      />

      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isStrikethrough }"
        @click="editorActions.toggleStrike"
      >
        <StrikethroughIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isCode }"
        @click="editorActions.toggleCode"
      >
        <CodeIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isHighlight }"
        @click="editorActions.toggleHighlight"
      >
        <HighlighterIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isSuperscript }"
        @click="editorActions.toggleSuperscript"
      >
        <SuperscriptIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isSubscript }"
        @click="editorActions.toggleSubscript"
      >
        <SubscriptIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        @click="handleLinkClick"
      >
        <Link2Icon class="h-4 w-4" />
      </Button>

      <Separator
        orientation="vertical"
        class="h-6"
      />

      <!-- Text Alignment -->
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isAlignLeft }"
        @click="editorActions.setTextAlign('left')"
      >
        <AlignLeftIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isAlignCenter }"
        @click="editorActions.setTextAlign('center')"
      >
        <AlignCenterIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isAlignRight }"
        @click="editorActions.setTextAlign('right')"
      >
        <AlignRightIcon class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isAlignJustify }"
        @click="editorActions.setTextAlign('justify')"
      >
        <AlignJustifyIcon class="h-4 w-4" />
      </Button>

      <Separator
        orientation="vertical"
        class="h-6"
      />

      <!-- Colors -->
      <TextColorPicker :editor="editor" />
      <BackgroundColorPicker :editor="editor" />

      <!-- Dialogs -->
      <LinkDialog
        v-model:open="linkDialogOpen"
        :editor="editor"
        :editor-actions="editorActions"
      />
    </div>
  </Teleport>
</template>
