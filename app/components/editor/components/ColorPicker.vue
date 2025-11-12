<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { Palette } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label/Label.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { backgroundColors, textColors, useColorPicker } from '@/composables/useColorPicker'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  editor: EditorType
}>()

const editorActions = useEditorActions(computed(() => props.editor))
const { recentlyUsed, loadRecentlyUsed, saveRecentlyUsed } = useColorPicker('background')
const open = ref(false)

const currentTextColor = computed(() => {
  return props.editor.getAttributes('textStyle')?.color || null
})

const currentBackgroundColor = computed(() => {
  return props.editor.getAttributes('textStyle')?.backgroundColor || null
})

function handleTextColorSelect(color: string) {
  editorActions.setTextColor(color)
}

function handleBackgroundColorSelect(color: string) {
  editorActions.setBackgroundColor(color)
  saveRecentlyUsed(color)
}

function handleTextColorClear() {
  editorActions.setTextColor('')
}

function handleBackgroundColorClear() {
  editorActions.setBackgroundColor('')
}

onMounted(() => {
  loadRecentlyUsed()
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :class="{ 'bg-accent': currentTextColor || currentBackgroundColor }"
      >
        <Palette class="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-60 p-4">
      <div class="space-y-4">
        <!-- Recently used background colors -->
        <div v-if="recentlyUsed.length > 0" class="space-y-3">
          <Label>
            Recently used
          </Label>
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="color in recentlyUsed"
              :key="color"
              class="h-8 rounded-[8px] border transition-all cursor-pointer"
              :style="{
                backgroundColor: color,
                borderColor: color === currentBackgroundColor ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }"
              :class="{ 'ring-2 ring-primary': color === currentBackgroundColor }"
              @click="handleBackgroundColorSelect(color)"
            >
              <span class="sr-only">{{ color }}</span>
            </button>
          </div>
        </div>
        <Separator orientation="horizontal" />
      </div>

      <div class="space-y-4">
        <!-- Text Colors Section -->
        <div class="space-y-3">
          <Label>
            Text Color
          </Label>
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="color in textColors"
              :key="color"
              class="flex h-8 items-center justify-center rounded-[8px] border transition-all cursor-pointer"
              :style="{
                color,
                borderColor: color === currentTextColor ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }"
              :class="{ 'ring-2 ring-primary': color === currentTextColor }"
              @click="handleTextColorSelect(color)"
            >
              <span class="text-sm font-medium">A</span>
            </button>
          </div>
          <Button
            v-if="currentTextColor"
            variant="secondary"
            size="sm"
            class="w-full"
            @click="handleTextColorClear"
          >
            Clear text color
          </Button>
        </div>

        <!-- Background Colors Section -->
        <div class="space-y-3">
          <Label>
            Background Color
          </Label>

          <!-- All background colors -->
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="color in backgroundColors"
              :key="color"
              class="h-8 rounded-[8px] border transition-all cursor-pointer"
              :style="{
                backgroundColor: color,
                borderColor: color === currentBackgroundColor ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }"
              :class="{ 'ring-2 ring-primary': color === currentBackgroundColor }"
              @click="handleBackgroundColorSelect(color)"
            >
              <span class="sr-only">{{ color }}</span>
            </button>
          </div>
          <Button
            v-if="currentBackgroundColor"
            variant="secondary"
            size="sm"
            class="w-full"
            @click="handleBackgroundColorClear"
          >
            Clear background color
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
