<script setup lang="ts">
import {
  ChevronRight,
  Code2Icon, FileText,
  Heading1,
  Heading2,
  Heading3, ImageIcon,
  Info, List,
  ListChecks,
  ListOrdered,
  Minus, Quote,
  SigmaIcon,
  SquareSigma, TypeIcon, YoutubeIcon
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

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

const selectedIndex = ref(0)
const searchQuery = ref(props.query || '')

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

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)

watch(props.items, () => {
  if (selectedIndex.value >= props.items.length) {
    selectedIndex.value = Math.max(0, props.items.length - 1)
  }
})

function onKeyDown({ event }: { event: KeyboardEvent }) {
  if (event.key === 'Enter') {
    event.preventDefault()
    selectItem(selectedIndex.value)
    return true
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    return true
  }

  return false
}

function selectItem(index: number) {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

function getItemIndex(item: SlashCommandItem): number {
  return props.items.findIndex((i: SlashCommandItem) => i.id === item.id)
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
  <Command class="w-[320px] max-h-[440px] h-auto bg-background rounded-lg border absolute z-50">
    <CommandInput
      v-model="searchQuery"
      placeholder="Search for a command"
    />
    <CommandList>
      <CommandEmpty>
        No results found.
      </CommandEmpty>
      <CommandGroup
        v-if="basicBlocks.length > 0"
        heading="Basic blocks"
      >
        <CommandItem
          v-for="item in basicBlocks"
          :key="item.id"
          :value="item.id"
          @select="selectItem(getItemIndex(item))"
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
</template>
