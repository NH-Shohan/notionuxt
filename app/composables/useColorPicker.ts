import { ref } from 'vue'

export const textColors = [
  '#000000', // black
  '#ffffff', // white
  '#d4d4d4', // light grey
  '#808080', // grey
  '#d4a574', // light brown/tan
  '#ff9500', // orange
  '#ffd700', // yellow
  '#4ade80', // green
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#f472b6', // pink
  '#ef4444', // red
]

export const backgroundColors = [
  '#00000055', // black
  '#ffffff55', // white
  '#d4d4d455', // light grey
  '#80808055', // grey
  '#d4a57455', // light brown/tan
  '#ff950055', // orange
  '#ffd70055', // yellow
  '#4ade8055', // green
  '#60a5fa55', // blue
  '#a78bfa55', // purple
  '#f472b655', // pink
  '#ef444455', // red
]

export function useColorPicker(type: 'text' | 'background') {
  const storageKey = type === 'text' ? 'recentlyUsedTextColors' : 'recentlyUsedBackgroundColors'
  const recentlyUsed = ref<string[]>([])

  function loadRecentlyUsed() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored)
        recentlyUsed.value = JSON.parse(stored)
    }
  }

  function saveRecentlyUsed(color: string) {
    if (typeof window === 'undefined')
      return

    const updated = [color, ...recentlyUsed.value.filter(c => c !== color)].slice(0, 6)
    recentlyUsed.value = updated
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  return {
    recentlyUsed,
    loadRecentlyUsed,
    saveRecentlyUsed,
  }
}
