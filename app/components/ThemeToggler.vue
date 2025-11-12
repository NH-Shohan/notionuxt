<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  duration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 750,
})

const isDark = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)
let observer: MutationObserver | null = null

function updateTheme() {
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  // Initialize theme from localStorage
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    }
  }

  updateTheme()

  observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

async function toggleTheme() {
  if (!buttonRef.value)
    return

  await document.startViewTransition(() => {
    const newTheme = !isDark.value
    isDark.value = newTheme
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }).ready

  const { top, left, width, height } = buttonRef.value.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const maxRadius = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top))

  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
    },
    {
      duration: props.duration,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    },
  )
}
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    :class="cn('cursor-pointer', props.class)"
    @click="toggleTheme"
  >
    <Moon
      v-if="isDark"
      stroke-width="1.5"
      class="size-5"
    />
    <Sun
      v-else
      stroke-width="1.5"
      class="size-5"
    />

    <span class="sr-only">Toggle theme</span>
  </button>
</template>
