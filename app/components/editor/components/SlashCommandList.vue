<script setup lang="ts">
import type { LinkDialogConfig } from '@/components/editor/dialogs/CommonDialog.vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import {
  ChevronRight,
  Code2Icon,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Info,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  SigmaIcon,
  SquareSigma,
  TypeIcon,
  YoutubeIcon,
} from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import CommonDialog from '@/components/editor/dialogs/CommonDialog.vue'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useEditorActions } from '@/composables/useEditorActions'

export interface SlashCommandItem {
  id: string
  title: string
  description?: string
  icon: string
  shortcut?: string
  command: (props: { editor: any, range: any }) => void
}

const props = defineProps<{
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
  editor: any
  query?: string
  range?: any
}>()

const iconMap: Record<string, any> = {
  TypeIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  ChevronRight,
  FileText,
  Info,
  Quote,
  Minus,
  Image: ImageIcon,
  Youtube: YoutubeIcon,
  Sigma: SigmaIcon,
  SquareSigma,
  Code2: Code2Icon,
}

const selectedIndex = ref<number | null>(null) // Start with no selection
const searchQuery = ref(props.query || '')
const commandRef = ref<HTMLElement | null>(null)
const commandListRef = ref<HTMLElement | null>(null)
const isKeyboardNavigation = ref(false) // Track if user is using keyboard

// Dialog state
const dialogOpen = ref(false)
const dialogConfig = ref<LinkDialogConfig>({ type: 'link' })
const pendingCommand = ref<SlashCommandItem | null>(null)
const pendingRange = ref<any>(null)
const editorActions = useEditorActions(computed(() => props.editor))

// Reset dialog state when dialog closes
watch(dialogOpen, (isOpen) => {
  if (!isOpen) {
    // Reset state when dialog closes
    pendingCommand.value = null
    pendingRange.value = null
    dialogConfig.value = { type: 'link' }
  }
})

// Prevent focus on mount and whenever items change
onMounted(() => {
  nextTick(() => {
    // Blur any focused element within the command component
    if (commandRef.value) {
      const focusedElement = commandRef.value.querySelector(':focus')
      if (focusedElement) {
        (focusedElement as HTMLElement).blur()
      }
      // Ensure editor stays focused
      props.editor?.commands?.focus()
    }
  })
})

// Prevent focus when items change
watch(
  () => props.items,
  () => {
    selectedIndex.value = null
    isKeyboardNavigation.value = false
    nextTick(() => {
      if (commandRef.value) {
        const focusedElement = commandRef.value.querySelector(':focus')
        if (focusedElement) {
          (focusedElement as HTMLElement).blur()
        }
        props.editor?.commands?.focus()
      }
    })
  },
)

// Handle focus events - immediately blur and refocus editor
function handleFocus(event: FocusEvent) {
  event.preventDefault()
  event.stopPropagation()
  nextTick(() => {
    (event.target as HTMLElement)?.blur()
    props.editor?.commands?.focus()
  })
}

// Handle outside click - just focus back to editor
onClickOutside(commandRef, (event) => {
  if (!props.editor?.view?.dom?.contains(event.target as Node)) {
    props.editor?.commands?.focus()
  }
})

// Handle ESC key - focus back to editor
onKeyStroke('Escape', (e) => {
  e.preventDefault()
  props.editor?.commands?.focus()
})

watch(
  () => props.query,
  (newQuery) => {
    searchQuery.value = newQuery || ''
  },
)

// Group items
const basicBlocks = computed(() => {
  const blockIds = [
    'text',
    'heading1',
    'heading2',
    'heading3',
    'bulletList',
    'numberedList',
    'taskList',
    'toggleList',
    'quote',
    'codeBlock',
    'horizontalRule',
    'image',
    'video',
    'inlineMath',
    'blockMath',
  ]
  return props.items.filter(item => blockIds.includes(item.id))
})

// Reset selected index when items change
watch(
  () => basicBlocks.value,
  () => {
    selectedIndex.value = null // Reset to no selection when items change
  },
)

// Scroll selected item into view
function scrollToSelected() {
  if (selectedIndex.value === null)
    return

  nextTick(() => {
    // Get the scrollable container - CommandList's root element is the ListboxContent with data-slot="command-list"
    let scrollableContainer: HTMLElement | null = null

    if (commandListRef.value) {
      // Get the root DOM element of the CommandList component (which is the ListboxContent)
      scrollableContainer = (commandListRef.value as any).$el as HTMLElement
    }

    // Fallback: try to get from commandRef
    if (!scrollableContainer && commandRef.value) {
      const commandElement = (commandRef.value as any).$el as HTMLElement
      if (commandElement) {
        scrollableContainer = commandElement.querySelector('[data-slot="command-list"]') as HTMLElement
      }
    }

    if (!scrollableContainer)
      return

    const items = scrollableContainer.querySelectorAll('[data-slot="command-item"]')
    const selectedItem = items[selectedIndex.value!] as HTMLElement

    if (selectedItem && scrollableContainer) {
      const isFirstItem = selectedIndex.value === 0
      const isLastItem = selectedIndex.value === items.length - 1

      // If on first item, scroll to top
      if (isFirstItem) {
        scrollableContainer.scrollTop = 0
        return
      }

      // If on last item, scroll to bottom
      if (isLastItem) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight
        return
      }

      // Otherwise, keep item in view
      const containerRect = scrollableContainer.getBoundingClientRect()
      const itemRect = selectedItem.getBoundingClientRect()

      // Calculate if item is outside visible area
      const itemTop = itemRect.top
      const itemBottom = itemRect.bottom
      const containerTop = containerRect.top
      const containerBottom = containerRect.bottom

      // Scroll down if item is below visible area
      if (itemBottom > containerBottom) {
        const scrollAmount = itemBottom - containerBottom
        scrollableContainer.scrollTop += scrollAmount
      }
      // Scroll up if item is above visible area
      else if (itemTop < containerTop) {
        const scrollAmount = containerTop - itemTop
        scrollableContainer.scrollTop -= scrollAmount
      }
    }
  })
}

function onKeyDown({ event }: { event: KeyboardEvent }) {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (selectedIndex.value !== null) {
      const selectedItem = basicBlocks.value[selectedIndex.value]
      if (selectedItem) {
        selectItem(getItemIndex(selectedItem))
      }
    }
    return true
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    isKeyboardNavigation.value = true

    if (basicBlocks.value.length > 0) {
      if (selectedIndex.value === null) {
        // Start from beginning if no selection
        selectedIndex.value = 0
      }
      else {
        // Move to next item
        selectedIndex.value = (selectedIndex.value + 1) % basicBlocks.value.length
      }
      scrollToSelected()
    }
    return true
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    isKeyboardNavigation.value = true

    if (basicBlocks.value.length > 0) {
      if (selectedIndex.value === null) {
        // Start from end if no selection
        selectedIndex.value = basicBlocks.value.length - 1
      }
      else {
        // Move to previous item
        selectedIndex.value = selectedIndex.value <= 0
          ? basicBlocks.value.length - 1
          : selectedIndex.value - 1
      }
      scrollToSelected()
    }
    return true
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    props.editor?.commands?.focus()
    return true
  }

  return false
}

function selectItem(index: number) {
  const item = props.items[index]
  if (item) {
    // Check if this command needs a dialog
    if (item.id === 'image' || item.id === 'video' || item.id === 'inlineMath' || item.id === 'blockMath') {
      // If a dialog is already open, close it first
      if (dialogOpen.value) {
        dialogOpen.value = false
        // Use nextTick to ensure the dialog closes before opening a new one
        nextTick(() => {
          openDialogForItem(item)
        })
      }
      else {
        openDialogForItem(item)
      }
    }
    else {
      // Execute command directly
      props.command(item)
    }
  }
}

function openDialogForItem(item: SlashCommandItem) {
  // Store the command and range for later execution
  pendingCommand.value = item
  pendingRange.value = props.range

  // Open appropriate dialog
  if (item.id === 'image') {
    dialogConfig.value = { type: 'image' }
  }
  else if (item.id === 'video') {
    dialogConfig.value = { type: 'youtube' }
  }
  else if (item.id === 'inlineMath') {
    dialogConfig.value = { type: 'inlineMath' }
  }
  else if (item.id === 'blockMath') {
    dialogConfig.value = { type: 'blockMath' }
  }

  dialogOpen.value = true
}

function handleDialogSave(value: string, file?: File) {
  if (!pendingCommand.value) {
    // Reset dialog state and close
    dialogOpen.value = false
    return
  }

  const item = pendingCommand.value

  // Convert file to data URL if it's a file upload
  const finalUrl = value
  if (file) {
    // Convert file to data URL for immediate use
    // In production, you'd upload the file to a server first
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      executeCommandWithValue(item, dataUrl)
    }
    reader.readAsDataURL(file)
    return
  }

  executeCommandWithValue(item, finalUrl)
}

function executeCommandWithValue(item: SlashCommandItem, value: string) {
  const { editor } = props
  const range = pendingRange.value

  if (!value) {
    // Close dialog and reset state
    dialogOpen.value = false
    pendingCommand.value = null
    pendingRange.value = null
    return
  }

  try {
    // Execute the command based on type
    if (item.id === 'image') {
      if (range && isValidRange(editor, range)) {
        // Delete the slash command range first, then insert image
        editor.chain().focus().deleteRange(range).run()
        editor.chain().focus().setImage({ src: value }).run()
      }
      else {
        editor.chain().focus().setImage({ src: value }).run()
      }
    }
    else if (item.id === 'video') {
      if (range && isValidRange(editor, range)) {
        // Delete the slash command range first, then insert video
        editor.chain().focus().deleteRange(range).run()
        editor.chain().focus().setYoutubeVideo({ src: value }).run()
      }
      else {
        editor.chain().focus().setYoutubeVideo({ src: value }).run()
      }
    }
    else if (item.id === 'inlineMath') {
      if (range && isValidRange(editor, range)) {
        // Delete the slash command range first, then insert inline math
        editor.chain().focus().deleteRange(range).run()
        editor.chain().focus().insertInlineMath({ latex: value }).run()
      }
      else {
        editor.chain().focus().insertInlineMath({ latex: value }).run()
      }
    }
    else if (item.id === 'blockMath') {
      if (range && isValidRange(editor, range)) {
        // Delete the slash command range first, then insert block math
        editor.chain().focus().deleteRange(range).run()
        editor.chain().focus().insertBlockMath({ latex: value }).run()
      }
      else {
        editor.chain().focus().insertBlockMath({ latex: value }).run()
      }
    }
  }
  catch (error) {
    console.warn('Error executing command:', error)
    // Fallback: just insert without deleting range
    if (item.id === 'inlineMath') {
      editor.chain().focus().insertInlineMath({ latex: value }).run()
    }
    else if (item.id === 'blockMath') {
      editor.chain().focus().insertBlockMath({ latex: value }).run()
    }
  }

  // Close dialog and reset state
  dialogOpen.value = false
  pendingCommand.value = null
  pendingRange.value = null
}

// Helper function to check if a range is valid
function isValidRange(editor: any, range: any) {
  try {
    const { doc } = editor.state
    const { from, to } = range
    return from >= 0 && to <= doc.content.size && from <= to
  }
  catch {
    return false
  }
}

function getItemIndex(item: SlashCommandItem): number {
  return props.items.findIndex((i: SlashCommandItem) => i.id === item.id)
}

function isSelected(item: SlashCommandItem): boolean {
  if (selectedIndex.value === null)
    return false
  const indexInBasicBlocks = basicBlocks.value.findIndex((i: SlashCommandItem) => i.id === item.id)
  return indexInBasicBlocks === selectedIndex.value
}

function handleMouseEnter(item: SlashCommandItem) {
  // Only update selection on hover if not in keyboard navigation mode
  if (isKeyboardNavigation.value)
    return

  const indexInBasicBlocks = basicBlocks.value.findIndex((i: SlashCommandItem) => i.id === item.id)
  selectedIndex.value = indexInBasicBlocks
}

function handleMouseLeave() {
  // Optional: Keep the selection on mouse leave
  // If you want to clear selection when mouse leaves, uncomment:
  // if (!isKeyboardNavigation.value) {
  //   selectedIndex.value = null
  // }
}

function handleMouseMove() {
  // When mouse moves, exit keyboard navigation mode
  if (isKeyboardNavigation.value) {
    isKeyboardNavigation.value = false
  }
}

function parseShortcut(shortcut: string | undefined): string[] | null {
  if (!shortcut) {
    return null
  }

  // Handle keyboard shortcuts like "Ctrl+B", "Ctrl+K", etc.
  if (shortcut.includes('Ctrl') || shortcut.includes('Cmd') || shortcut.includes('Alt') || shortcut.includes('Shift')) {
    return shortcut
      .split(/[+\-]/)
      .map(k => k.trim())
      .filter(Boolean)
  }

  // Handle simple shortcuts like "#", "##", "-", etc.
  return [shortcut]
}

function isMultiKeyShortcut(shortcut: string | undefined): boolean {
  if (!shortcut) {
    return false
  }
  return (
    shortcut.includes('Ctrl') || shortcut.includes('Cmd') || shortcut.includes('Alt') || shortcut.includes('Shift')
  )
}

defineExpose({
  onKeyDown,
})
</script>

<template>
  <Command
    ref="commandRef"
    class="w-[320px] max-h-[440px] h-auto bg-background rounded-lg border absolute z-50"
    :class="{ 'keyboard-navigation': isKeyboardNavigation }"
    @focus="handleFocus"
    @focusin="handleFocus"
    @mousemove="handleMouseMove"
  >
    <CommandList
      ref="commandListRef"
      tabindex="-1"
      @focus="handleFocus"
      @focusin="handleFocus"
    >
      <CommandGroup
        v-if="basicBlocks.length > 0"
        heading="Basic blocks"
      >
        <CommandItem
          v-for="item in basicBlocks"
          :key="item.id"
          :value="item.id"
          :data-selected="isSelected(item)"
          :class="{ 'bg-accent text-accent-foreground': isSelected(item) }"
          @select="selectItem(getItemIndex(item))"
          @mouseenter="() => !isKeyboardNavigation && handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <component
            :is="iconMap[item.icon]"
            class="mr-1 h-4 w-4"
          />
          <span>{{ item.title }}</span>
          <template v-if="item.shortcut">
            <template v-if="isMultiKeyShortcut(item.shortcut)">
              <KbdGroup class="ml-auto">
                <template
                  v-for="(key, index) in parseShortcut(item.shortcut)"
                  :key="index"
                >
                  <Kbd>{{ key }}</Kbd>
                  <span v-if="index < (parseShortcut(item.shortcut)?.length ?? 0) - 1">+</span>
                </template>
              </KbdGroup>
            </template>
            <Kbd
              v-else
              class="ml-auto"
            >
              {{ item.shortcut }}
            </Kbd>
          </template>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>

  <!-- Dialog for image, video, and math commands -->
  <CommonDialog
    v-model:open="dialogOpen"
    :editor="editor"
    :editor-actions="editorActions"
    :config="dialogConfig"
    :on-save="handleDialogSave"
  />
</template>

<style scoped>
/* Disable hover styles when in keyboard navigation mode, but keep selection styles */
.keyboard-navigation :deep([data-slot='command-item']:hover:not(.bg-accent)) {
  background-color: transparent !important;
  color: inherit !important;
}
</style>
