<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckSquareIcon,
  CodeIcon,
  EllipsisVerticalIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TypeIcon,
  UnderlineIcon,
} from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ColorPicker from '@/components/editor/components/ColorPicker.vue'
import CommonDialog from '@/components/editor/dialogs/CommonDialog.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  editor: EditorType
}>()

const editorActions = useEditorActions(computed(() => props.editor))

const show = ref(false)
const position = ref({ top: 0, left: 0, transform: 'translateX(-50%)' })
const toolbarRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// Close toolbar
function closeToolbar() {
  show.value = false
}

// Handle outside click
onClickOutside(toolbarRef, (event) => {
  // Don't close if clicking inside the editor or if a dialog is open
  if (show.value && !editorActions.dialogOpen.value && !props.editor.view.dom.contains(event.target as Node)) {
    closeToolbar()
  }
})

// Handle ESC key
onKeyStroke('Escape', (e) => {
  if (editorActions.dialogOpen.value) {
    // If dialog is open, close dialog first
    editorActions.dialogOpen.value = false
    e.preventDefault()
  }
  else if (show.value) {
    // Otherwise close toolbar
    e.preventDefault()
    closeToolbar()
  }
})

// Define toolbar buttons configuration
const formatButtons = [
  { icon: BoldIcon, action: () => editorActions.toggleBold(), active: 'bold' },
  { icon: ItalicIcon, action: () => editorActions.toggleItalic(), active: 'italic' },
  { icon: UnderlineIcon, action: () => editorActions.toggleUnderline(), active: 'underline' },
  { icon: StrikethroughIcon, action: () => editorActions.toggleStrike(), active: 'strike' },
] as const

const styleButtons = [
  { icon: CodeIcon, action: () => editorActions.toggleCode(), active: 'code' },
  { icon: SuperscriptIcon, action: () => editorActions.toggleSuperscript(), active: 'superscript' },
  { icon: SubscriptIcon, action: () => editorActions.toggleSubscript(), active: 'subscript' },
  { icon: Link2Icon, action: () => editorActions.toggleLink(), active: null },
  { icon: HighlighterIcon, action: () => editorActions.toggleHighlight(), active: 'highlight' },
] as const

const alignButtons = [
  { icon: AlignLeftIcon, action: () => editorActions.setTextAlign('left'), align: 'left' },
  { icon: AlignCenterIcon, action: () => editorActions.setTextAlign('center'), align: 'center' },
  { icon: AlignRightIcon, action: () => editorActions.setTextAlign('right'), align: 'right' },
  { icon: AlignJustifyIcon, action: () => editorActions.setTextAlign('justify'), align: 'justify' },
] as const

// Check if button is active
function isActive(button: typeof formatButtons[number] | typeof styleButtons[number]) {
  return button.active ? props.editor.isActive(button.active) : false
}

function isAlignActive(align: string) {
  return props.editor.isActive({ textAlign: align })
}

function isBlockActive(button: typeof editorActions.blockButtons[number]) {
  if (button.active === 'heading') {
    return props.editor.isActive('heading', { level: button.level })
  }
  return button.active ? props.editor.isActive(button.active) : false
}

function getBlockIcon(iconName: string) {
  const iconMap = {
    TypeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListIcon,
    ListOrderedIcon,
    CheckSquareIcon,
    QuoteIcon,
  }
  return iconMap[iconName as keyof typeof iconMap] || EllipsisVerticalIcon
}

function updatePosition() {
  const { state, view } = props.editor
  const { selection } = state
  const { from, to } = selection

  // Check if this is a node selection (indicating drag handle usage) or if dragging
  const isNodeSelection = (selection as any).node !== undefined

  // Hide toolbar during drag operations or node selections
  if (from === to || isNodeSelection || isDragging.value) {
    show.value = false
    return
  }

  const start = view.coordsAtPos(from)
  const end = view.coordsAtPos(to)
  const centerX = (start.left + end.left) / 2
  const centerY = Math.min(start.top, end.top)

  // Set initial position and show toolbar
  position.value = {
    top: centerY - 46,
    left: centerX,
    transform: 'translateX(-50%)',
  }
  show.value = true

  // Wait for next tick to get toolbar dimensions and adjust position
  nextTick(() => {
    if (!toolbarRef.value || !show.value) {
      return
    }

    const toolbarRect = toolbarRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const toolbarHeight = toolbarRect.height || 46
    const toolbarWidth = toolbarRect.width || 200
    const padding = 8 // Padding from viewport edges

    // Calculate initial position (centered horizontally)
    let top = centerY - toolbarHeight - 8 // 8px gap above selection
    let left = centerX
    let transform = 'translateX(-50%)' // Center horizontally

    // Check if toolbar would go off the top
    if (top < padding) {
      // Position below selection instead
      top = Math.max(start.bottom, end.bottom) + 8
    }

    // Check if toolbar would go off the bottom
    if (top + toolbarHeight > viewportHeight - padding) {
      // Try to position above, but if that doesn't work, position at top
      const topPosition = centerY - toolbarHeight - 8
      if (topPosition >= padding) {
        top = topPosition
      }
      else {
        top = padding
      }
    }

    // Check horizontal boundaries
    const halfWidth = toolbarWidth / 2
    const leftEdge = left - halfWidth
    const rightEdge = left + halfWidth

    // Check if toolbar would go off the right
    if (rightEdge > viewportWidth - padding) {
      // Adjust to fit within viewport, align to right edge
      left = viewportWidth - padding - halfWidth
      // If still too wide, remove centering transform and align to right
      if (left - halfWidth < padding) {
        left = viewportWidth - padding
        transform = 'translateX(-100%)'
      }
    }

    // Check if toolbar would go off the left
    if (leftEdge < padding) {
      // Adjust to fit within viewport, align to left edge
      left = padding + halfWidth
      // If still too wide, remove centering transform and align to left
      if (left + halfWidth > viewportWidth - padding) {
        left = padding
        transform = 'translateX(0)'
      }
    }

    position.value = {
      top,
      left,
      transform,
    }
  })
}

let rafId: number | null = null
function scheduleUpdate() {
  if (rafId !== null)
    return

  rafId = requestAnimationFrame(() => {
    updatePosition()
    rafId = null
  })
}

onMounted(() => {
  if (props.editor) {
    props.editor.on('selectionUpdate', scheduleUpdate)
    props.editor.on('update', scheduleUpdate)
    updatePosition()
  }

  // Add global drag event listeners
  document.addEventListener('dragstart', () => {
    isDragging.value = true
  })
  document.addEventListener('dragend', () => {
    isDragging.value = false
  })
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  if (props.editor) {
    props.editor.off('selectionUpdate', scheduleUpdate)
    props.editor.off('update', scheduleUpdate)
  }

  // Remove drag event listeners
  document.removeEventListener('dragstart', () => {
    isDragging.value = true
  })
  document.removeEventListener('dragend', () => {
    isDragging.value = false
  })
})

watch(() => props.editor, (newEditor, oldEditor) => {
  if (oldEditor) {
    oldEditor.off('selectionUpdate', scheduleUpdate)
    oldEditor.off('update', scheduleUpdate)
  }

  if (newEditor) {
    newEditor.on('selectionUpdate', scheduleUpdate)
    newEditor.on('update', scheduleUpdate)
    updatePosition()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="toolbarRef"
      class="fixed z-50 flex items-center gap-1 rounded-lg border bg-background px-1 py-1 shadow-lg"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: position.transform,
      }"
    >
      <!-- Text Formatting -->
      <Button
        v-for="(btn, idx) in formatButtons"
        :key="idx"
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isActive(btn) }"
        @click="btn.action"
      >
        <component :is="btn.icon" class="h-4 w-4" stroke-width="2" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <!-- Text Alignment -->
      <Button
        v-for="(btn, idx) in alignButtons"
        :key="idx"
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isAlignActive(btn.align) }"
        @click="btn.action"
      >
        <component :is="btn.icon" class="h-4 w-4" stroke-width="2" />
      </Button>

      <div class="w-px h-6 bg-border mx-1" />

      <!-- Style Buttons -->
      <Button
        v-for="(btn, idx) in styleButtons"
        :key="idx"
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': isActive(btn) }"
        @click="btn.action"
      >
        <component :is="btn.icon" class="h-4 w-4" stroke-width="2" />
      </Button>

      <!-- Colors -->
      <ColorPicker :editor="editor" />

      <!-- <Separator orientation="vertical" /> -->
      <div class="w-px h-6 bg-border ml-1" />

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-8 w-8">
            <EllipsisVerticalIcon class="h-4 w-4" stroke-width="2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem
            v-for="(btn, idx) in editorActions.blockButtons"
            :key="idx"
            :class="{ 'bg-accent': isBlockActive(btn) }"
            @click="btn.action"
          >
            <component :is="getBlockIcon(btn.icon)" class="h-4 w-4 mr-2" stroke-width="2" />
            {{ btn.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Dialogs -->
      <CommonDialog
        v-model:open="editorActions.dialogOpen.value"
        :editor="editor"
        :editor-actions="editorActions"
        :config="editorActions.dialogConfig.value"
        :on-save="editorActions.handleDialogSave"
      />
    </div>
  </Teleport>
</template>
