import { h, render } from 'vue'

/**
 * Mounts a Vue component into a detached element, the way Tiptap's
 * VueRenderer did: exposes `element`, `ref` (the component's exposed API),
 * `updateProps()` and `destroy()`.
 */
export function createPopupRenderer(component, initialProps) {
  const element = document.createElement('div')
  let exposed = null
  let props = { ...initialProps }

  function draw() {
    const vnode = h(component, props)
    render(vnode, element)
    // A ref prop cannot be set outside a parent component context, so the
    // instance is read off the vnode: `exposed` for <script setup> components,
    // the public proxy for Options API ones.
    const instance = vnode.component
    exposed = instance ? (instance.exposed ?? instance.proxy) : null
  }

  draw()

  return {
    element,
    get ref() {
      return exposed
    },
    updateProps(next) {
      props = { ...props, ...next }
      draw()
    },
    destroy() {
      render(null, element)
      exposed = null
    },
  }
}

/**
 * Positions a popup element near an anchor rect with viewport clamping and
 * vertical flipping, replacing the previous floating-ui usage.
 */
export function positionPopup(element, anchorRect, { gap = 8, padding = 8, fallbackWidth = 320, fallbackHeight = 440 } = {}) {
  if (!element || !anchorRect) {
    return
  }

  // Set an initial position immediately to avoid flickering
  Object.assign(element.style, {
    position: 'fixed',
    left: `${anchorRect.left}px`,
    top: `${anchorRect.bottom + gap}px`,
    zIndex: '50',
  })

  // Refine once the element has been laid out and has real dimensions
  requestAnimationFrame(() => {
    if (!element.isConnected) {
      return
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const menuWidth = element.offsetWidth || fallbackWidth
    const menuHeight = element.offsetHeight || fallbackHeight

    let top = anchorRect.bottom + gap
    let left = anchorRect.left

    // Flip above the anchor if the popup would go off the bottom
    if (top + menuHeight > viewportHeight - padding) {
      const above = anchorRect.top - menuHeight - gap
      top = above >= padding ? above : Math.max(padding, viewportHeight - menuHeight - padding)
    }

    // Clamp horizontally
    if (left + menuWidth > viewportWidth - padding) {
      left = viewportWidth - menuWidth - padding
    }
    if (left < padding) {
      left = padding
    }

    Object.assign(element.style, {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: '50',
    })
  })
}

/**
 * The viewport rect of the active suggestion decoration, or the caret as a
 * fallback while the decoration has not painted yet.
 */
export function suggestionAnchorRect(decorationClass) {
  const decoration = document.querySelector(`.${decorationClass}`)
  if (decoration) {
    return decoration.getBoundingClientRect()
  }

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const rects = selection.getRangeAt(0).getClientRects()
    if (rects.length > 0) {
      return rects[0]
    }
  }
  return null
}
