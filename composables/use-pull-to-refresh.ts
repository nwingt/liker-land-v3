const PULL_THRESHOLD = 80
const MAX_PULL_DISTANCE = 120

export function usePullToRefresh() {
  const startY = ref(0)
  const currentY = ref(0)
  const isPulling = ref(false)
  const isRefreshing = ref(false)
  const pullDistance = ref(0)

  const pullProgress = computed(() => {
    return Math.min(pullDistance.value / PULL_THRESHOLD, 1)
  })

  function handleTouchStart(e: TouchEvent) {
    if (window.scrollY === 0 && !isRefreshing.value && e.touches[0]) {
      startY.value = e.touches[0].clientY
      isPulling.value = true
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isPulling.value || isRefreshing.value || !e.touches[0]) return

    currentY.value = e.touches[0].clientY
    const distance = currentY.value - startY.value

    if (distance > 0) {
      pullDistance.value = Math.min(distance * 0.5, MAX_PULL_DISTANCE)

      if (pullDistance.value > 10) {
        e.preventDefault()
      }
    }
  }

  async function handleTouchEnd() {
    if (!isPulling.value || isRefreshing.value) return

    if (pullDistance.value >= PULL_THRESHOLD) {
      isRefreshing.value = true
      try {
        // Add a small delay for animation
        await sleep(1000)
        reloadNuxtApp()
      }
      finally {
        isRefreshing.value = false
      }
    }

    isPulling.value = false
    pullDistance.value = 0
    startY.value = 0
    currentY.value = 0
  }

  return {
    isPulling: readonly(isPulling),
    isRefreshing: readonly(isRefreshing),
    pullDistance: readonly(pullDistance),
    pullProgress: readonly(pullProgress),
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
