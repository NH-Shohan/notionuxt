<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export type LinkDialogType = 'link' | 'youtube' | 'image' | 'custom'

export interface LinkDialogConfig {
  title?: string
  description?: string
  placeholder?: string
  type?: LinkDialogType
}

const props = withDefaults(defineProps<{
  open: boolean
  editor: EditorType
  editorActions: ReturnType<typeof import('@/composables/useEditorActions').useEditorActions>
  config?: LinkDialogConfig
  onSave?: (url: string) => void
}>(), {
  config: () => ({
    title: 'Add Link',
    description: 'Enter the URL for the link',
    placeholder: 'https://example.com',
    type: 'link',
  }),
})

const emits = defineEmits<{
  'update:open': [value: boolean]
}>()

const url = ref('')
const previousUrl = ref('')

const dialogTitle = computed(() => props.config?.title || 'Add Link')
const dialogDescription = computed(() => props.config?.description || 'Enter the URL for the link')
const inputPlaceholder = computed(() => props.config?.placeholder || 'https://example.com')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.config?.type === 'link') {
        previousUrl.value = props.editor.getAttributes('link').href || ''
        url.value = previousUrl.value
      }
      else {
        url.value = ''
      }
    }
  },
)

function handleSave() {
  if (props.onSave) {
    props.onSave(url.value)
  }
  else {
    // Default behavior for link
    if (props.config?.type === 'link') {
      if (url.value) {
        props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value, target: '_blank' }).run()
      }
      else {
        props.editor.chain().focus().unsetLink().run()
      }
    }
  }
  emits('update:open', false)
}

function handleCancel() {
  emits('update:open', false)
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="emits('update:open', $event)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>
      <Input
        v-model="url"
        :placeholder="inputPlaceholder"
        @keyup.enter="handleSave"
      />
      <DialogFooter>
        <Button
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button @click="handleSave">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
