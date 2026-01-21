<template>
  <div
    ref="containerRef"
    class="flex flex-col min-h-svh pb-(--intercom-launcher-offset)"
  >
    <!-- Pull to refresh indicator -->
    <div
      v-if="isApp && (isPulling || isRefreshing)"
      class="fixed top-0 left-0 right-0 flex items-center justify-center transition-opacity z-50"
      :style="indicatorStyle"
    >
      <UIcon
        v-if="isRefreshing"
        class="text-muted animate-spin"
        name="i-material-symbols-refresh-rounded"
        :size="32"
        :style="{ animationDuration: '200ms' }"
      />
      <UIcon
        v-else
        class="text-muted"
        name="i-material-symbols-refresh-rounded"
        :size="32"
        :style="spinnerStyle"
      />
    </div>

    <div :style="contentStyle">
      <slot />
    </div>

    <AppFooter v-show="isFooterVisible" />

    <AppTabBar v-show="isTabBarVisible" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  isFooterVisible: {
    type: Boolean,
    default: false,
  },
  isTabBarVisible: {
    type: Boolean,
    default: true,
  },
})

const { isApp } = useAppDetection()

const containerRef = ref<HTMLElement>()

const {
  isPulling,
  isRefreshing,
  pullDistance,
  pullProgress,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = usePullToRefresh()

const contentStyle = computed(() => {
  if (!isApp.value) return {}
  return {
    transform: `translateY(${pullDistance.value}px)`,
    transition: isPulling.value ? 'none' : 'transform 0.3s ease-out',
  }
})

const indicatorStyle = computed(() => ({
  height: `${pullDistance.value}px`,
  opacity: pullProgress.value,
}))

const spinnerStyle = computed(() => ({
  transform: `rotate(${pullProgress.value * 360}deg)`,
}))

onMounted(() => {
  if (isApp.value && containerRef.value) {
    useEventListener(containerRef, 'touchstart', handleTouchStart, { passive: true })
    useEventListener(containerRef, 'touchmove', handleTouchMove, { passive: false })
    useEventListener(containerRef, 'touchend', handleTouchEnd, { passive: true })
  }
})
</script>
