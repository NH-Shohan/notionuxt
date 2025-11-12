<script setup lang="ts">
import type { Editor as EditorType } from '@tiptap/vue-3'
import { Link2, Upload, YoutubeIcon } from 'lucide-vue-next'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'

export type LinkDialogType = 'link' | 'youtube' | 'image' | 'inlineMath' | 'blockMath' | 'custom'

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
  onSave?: (value: string, file?: File) => void
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
const imageSource = ref<'link' | 'upload'>('link')
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const dialogTitle = computed(() => {
  if (props.config?.title)
    return props.config.title
  switch (props.config?.type) {
    case 'image':
      return 'Insert Image'
    case 'youtube':
      return 'Embed YouTube Video'
    case 'inlineMath':
      return 'Insert Inline Math'
    case 'blockMath':
      return 'Insert Block Math'
    default:
      return 'Add Link'
  }
})

const dialogDescription = computed(() => {
  if (props.config?.description)
    return props.config.description
  switch (props.config?.type) {
    case 'image':
      return 'Upload an image or enter an image URL'
    case 'youtube':
      return 'Enter the YouTube video URL'
    case 'inlineMath':
      return 'Enter LaTeX math expression'
    case 'blockMath':
      return 'Enter LaTeX math expression'
    default:
      return 'Enter the URL for the link'
  }
})

const inputPlaceholder = computed(() => {
  if (props.config?.placeholder)
    return props.config.placeholder
  switch (props.config?.type) {
    case 'image':
      return 'https://example.com/image.jpg'
    case 'youtube':
      return 'https://www.youtube.com/watch?v=...'
    case 'inlineMath':
      return 'E = mc^2'
    case 'blockMath':
      return '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}'
    default:
      return 'https://example.com'
  }
})

const isMathType = computed(() => props.config?.type === 'inlineMath' || props.config?.type === 'blockMath')
const isImageType = computed(() => props.config?.type === 'image')
const isYoutubeType = computed(() => props.config?.type === 'youtube')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Always reset all state when opening
      if (props.config?.type === 'link') {
        previousUrl.value = props.editor.getAttributes('link').href || ''
        url.value = previousUrl.value
        selectedFile.value = null
        imageSource.value = 'link'
      }
      else {
        url.value = ''
        selectedFile.value = null
        imageSource.value = 'link'
        // Reset file input
        if (fileInputRef.value) {
          fileInputRef.value.value = ''
        }
      }
    }
  },
)

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    // Create a preview URL for the file
    url.value = URL.createObjectURL(file)
  }
}

function handleUploadClick() {
  fileInputRef.value?.click()
}

function handleSave() {
  if (props.onSave) {
    props.onSave(url.value, selectedFile.value || undefined)
  }
  else {
    // Default behavior
    if (props.config?.type === 'link') {
      if (url.value) {
        props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value, target: '_blank' }).run()
      }
      else {
        props.editor.chain().focus().unsetLink().run()
      }
    }
  }

  // Reset state after saving
  url.value = ''
  selectedFile.value = null
  imageSource.value = 'link'
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }

  emits('update:open', false)
}

function handleCancel() {
  // Clean up object URL if it was created
  if (selectedFile.value && url.value.startsWith('blob:')) {
    URL.revokeObjectURL(url.value)
  }

  // Reset all state
  url.value = ''
  selectedFile.value = null
  imageSource.value = 'link'
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }

  emits('update:open', false)
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="emits('update:open', $event)"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>{{ dialogDescription }}</DialogDescription>
      </DialogHeader>

      <!-- Image with upload/link options -->
      <div v-if="isImageType" class="space-y-4">
        <div class="flex gap-2">
          <Button
            variant="outline"
            :class="{ 'bg-accent': imageSource === 'link' }"
            class="flex-1"
            @click="imageSource = 'link'"
          >
            <Link2 class="mr-2 h-4 w-4" />
            Link
          </Button>
          <Button
            variant="outline"
            :class="{ 'bg-accent': imageSource === 'upload' }"
            class="flex-1"
            @click="imageSource = 'upload'"
          >
            <Upload class="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        <InputGroup v-if="imageSource === 'link'">
          <InputGroupAddon align="inline-start">
            <Link2 class="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="url"
            :placeholder="inputPlaceholder"
            @keyup.enter="handleSave"
          />
        </InputGroup>

        <div v-else class="space-y-2">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          >
          <InputGroup>
            <InputGroupInput
              :value="selectedFile?.name || 'No file selected'"
              placeholder="Select an image file"
              readonly
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton @click="handleUploadClick">
                <Upload class="h-4 w-4" />
                Browse
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p class="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      <!-- Math with textarea -->
      <div v-else-if="isMathType" class="space-y-2">
        <InputGroup>
          <InputGroupTextarea
            v-model="url"
            :placeholder="inputPlaceholder"
            class="min-h-24"
            @keydown.enter.ctrl="handleSave"
            @keydown.enter.meta="handleSave"
          />
        </InputGroup>
        <p class="text-xs text-muted-foreground">
          Press Ctrl+Enter (Cmd+Enter on Mac) to save
        </p>
      </div>

      <!-- YouTube with link -->
      <div v-else-if="isYoutubeType" class="space-y-2">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <YoutubeIcon class="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="url"
            :placeholder="inputPlaceholder"
            @keydown.enter.ctrl="handleSave"
            @keydown.enter.meta="handleSave"
          />
        </InputGroup>
        <p class="text-xs text-muted-foreground">
          Press Ctrl+Enter (Cmd+Enter on Mac) to save
        </p>
      </div>

      <!-- Default link input -->
      <div v-else class="space-y-2">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Link2 class="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="url"
            :placeholder="inputPlaceholder"
            @keyup.enter="handleSave"
          />
        </InputGroup>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          :disabled="!url && !selectedFile"
          @click="handleSave"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
