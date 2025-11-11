<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { PaintbrushIcon } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { backgroundColors, useColorPicker } from '@/composables/useColorPicker'
import { useEditorActions } from '@/composables/useEditorActions'

const props = defineProps<{
  editor: EditorType
}>()

const editorActions = useEditorActions(computed(() => props.editor))
const { recentlyUsed, loadRecentlyUsed, saveRecentlyUsed } = useColorPicker('background')
const open = ref(false)

const currentColor = computed(() => {
  return props.editor.getAttributes('textStyle')?.backgroundColor || null
})

function handleColorSelect(color: string) {
  editorActions.setBackgroundColor(color)
  saveRecentlyUsed(color)
  open.value = false
}

function handleClear() {
  editorActions.setBackgroundColor('')
  open.value = false
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
        :class="{ 'bg-accent': currentColor }"
      >
        <PaintbrushIcon class="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-64 p-3">
      <div class="space-y-3">
        <!-- Recently used -->
        <div v-if="recentlyUsed.length > 0" class="space-y-2">
          <div class="text-xs font-medium text-muted-foreground">
            Recently used
          </div>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="color in recentlyUsed"
              :key="color"
              class="h-8 w-8 rounded-md border transition-all hover:scale-105"
              :style="{
                backgroundColor: color,
                borderColor: color === currentColor ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }"
              :class="{ 'ring-2 ring-primary': color === currentColor }"
              @click="handleColorSelect(color)"
            >
              <span class="sr-only">{{ color }}</span>
            </button>
          </div>
        </div>

        <!-- Background colors -->
        <div class="space-y-2">
          <div class="text-xs font-medium text-muted-foreground">
            Background color
          </div>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="color in backgroundColors"
              :key="color"
              class="h-8 w-8 rounded-md border transition-all hover:scale-105"
              :style="{
                backgroundColor: color,
                borderColor: color === currentColor ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }"
              :class="{ 'ring-2 ring-primary': color === currentColor }"
              @click="handleColorSelect(color)"
            >
              <span class="sr-only">{{ color }}</span>
            </button>
          </div>
        </div>

        <!-- Clear button -->
        <Button
          v-if="currentColor"
          variant="ghost"
          size="sm"
          class="w-full"
          @click="handleClear"
        >
          Clear color
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
