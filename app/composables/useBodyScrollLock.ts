import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'

let lockCount = 0
let originalBodyOverflow: string | null = null

/**
 * Utility functions to lock/unlock body scrolling
 * Uses reference counting to handle multiple components locking scroll simultaneously
 */
export function lockBodyScroll() {
  lockCount++

  if (lockCount === 1) {
    // First lock - save original overflow and disable scroll
    originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

export function unlockBodyScroll() {
  lockCount--

  if (lockCount === 0) {
    // Last unlock - restore original overflow
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow
    }
    else {
      document.body.style.overflow = ''
    }
    originalBodyOverflow = null
  }
  else if (lockCount < 0) {
    // Safety check - should never happen, but reset if it does
    lockCount = 0
  }
}

/**
 * Composable to lock/unlock body scrolling based on a reactive condition
 * Automatically unlocks on unmount
 */
export function useBodyScrollLock(condition: Ref<boolean>) {
  watch(condition, (isOpen) => {
    if (isOpen) {
      lockBodyScroll()
    }
    else {
      unlockBodyScroll()
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (condition.value) {
      unlockBodyScroll()
    }
  })
}
