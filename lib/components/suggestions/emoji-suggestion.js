import { activeSuggestion, searchEmoji } from '@matrajs/core'

import EmojiList from '../components/EmojiList.vue'
import { createPopupRenderer, positionPopup, suggestionAnchorRect } from './renderer'

const SUGGESTION_NAME = 'emojiPicker'
const DECORATION_CLASS = 'matra-suggestion-emoji'

/**
 * Owns the :emoji: picker for one editor. Accepting an entry replaces the
 * trigger range with the emoji character. Returns a teardown function.
 */
export function watchEmojiPicker(editor) {
  let component = null

  function hide() {
    if (!component) {
      return
    }
    if (document.body.contains(component.element)) {
      document.body.removeChild(component.element)
    }
    component.destroy()
    component = null
  }

  function selectItem(item) {
    hide()
    editor.commands.acceptEmojiPicker(item.emoji)
    editor.commands.focus()
  }

  function sync() {
    const active = activeSuggestion(editor, SUGGESTION_NAME)
    if (!active) {
      hide()
      return
    }

    const items = searchEmoji(active.query, 5)
    if (items.length === 0) {
      hide()
      return
    }

    const props = {
      items,
      command: selectItem,
    }

    if (!component) {
      component = createPopupRenderer(EmojiList, props)
      document.body.appendChild(component.element)
    }
    else {
      component.updateProps(props)
    }

    positionPopup(component.element, suggestionAnchorRect(DECORATION_CLASS))
  }

  function onKeyDown(event) {
    if (!component) {
      return
    }
    const target = event.target
    if (target instanceof Element && !target.closest('.matra-editor')) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      editor.commands.cancelEmojiPicker()
      hide()
      editor.commands.focus()
      return
    }

    const handled = component.ref?.onKeyDown?.({ event })
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const offChange = editor.on('change', sync)
  const offSelection = editor.on('selectionChange', sync)
  document.addEventListener('keydown', onKeyDown, true)

  return () => {
    document.removeEventListener('keydown', onKeyDown, true)
    offChange()
    offSelection()
    hide()
  }
}
