import { activeSuggestion } from '@matrajs/core'

import MentionList from '@/components/editor/components/MentionList.vue'
import { createPopupRenderer, positionPopup, suggestionAnchorRect } from './renderer'

const SUGGESTION_NAME = 'mentionPicker'
const DECORATION_CLASS = 'matra-suggestion-mention'

const NAMES = [
  'Lea Thompson',
  'Cyndi Lauper',
  'Tom Cruise',
  'Madonna',
  'Jerry Hall',
  'Joan Collins',
  'Winona Ryder',
  'Christina Applegate',
  'Alyssa Milano',
  'Molly Ringwald',
  'Ally Sheedy',
  'Debbie Harry',
  'Olivia Newton-John',
  'Elton John',
  'Michael J. Fox',
  'Axl Rose',
  'Emilio Estevez',
  'Ralph Macchio',
  'Rob Lowe',
  'Jennifer Grey',
  'Mickey Rourke',
  'John Cusack',
  'Matthew Broderick',
  'Justine Bateman',
  'Lisa Bonet',
]

function filterItems(query) {
  return NAMES
    .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 5)
}

/**
 * Owns the @-mention picker for one editor. Accepting an entry replaces the
 * trigger range with a mention node in a single step. Returns a teardown
 * function.
 */
export function watchMentionPicker(editor) {
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

  function selectItem({ id }) {
    hide()
    editor.commands.acceptMentionPicker({
      type: 'mention',
      attrs: { id, label: id },
    })
    editor.commands.focus()
  }

  function sync() {
    const active = activeSuggestion(editor, SUGGESTION_NAME)
    if (!active) {
      hide()
      return
    }

    const props = {
      items: filterItems(active.query),
      command: selectItem,
    }

    if (!component) {
      component = createPopupRenderer(MentionList, props)
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
      editor.commands.cancelMentionPicker()
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
