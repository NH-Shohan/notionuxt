import { ref } from 'vue'

export const textColors = [
  '#ffffff', // white
  '#d4d4d4', // light grey
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
  '#f5f5f5', // very light grey
  '#404040', // dark grey
  '#d4a574', // light brown
  '#b8860b', // orange-brown
  '#9a9a00', // olive green
  '#166534', // dark green
  '#1e3a8a', // dark blue
  '#581c87', // dark purple
  '#9f1239', // dark pink/magenta
  '#7f1d1d', // dark red/maroon
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

    const updated = [color, ...recentlyUsed.value.filter(c => c !== color)].slice(0, 5)
    recentlyUsed.value = updated
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  return {
    recentlyUsed,
    loadRecentlyUsed,
    saveRecentlyUsed,
  }
}
