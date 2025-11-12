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
  '#00000088', // black
  '#f5f5f588', // very light grey
  '#80808088', // grey
  '#40404088', // dark grey
  '#d4a57488', // light brown
  '#b8860b88', // orange-brown
  '#9a9a0088', // olive green
  '#16653488', // dark green
  '#1e3a8a88', // dark blue
  '#581c8788', // dark purple
  '#9f123988', // dark pink/magenta
  '#7f1d1d88', // dark red/maroon
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
