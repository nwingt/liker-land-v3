export function useColorModeSync() {
  const colorMode = useColorMode()

  const syncedColorMode = useSyncedUserSettings<ColorMode>({
    key: 'colorMode',
    defaultValue: 'system',
  })

  // Sync color mode preference on mount
  onMounted(() => {
    if (syncedColorMode.value) {
      colorMode.preference = syncedColorMode.value
    }
  })

  // Watch for changes to synced settings and update color mode
  watch(syncedColorMode, (newValue) => {
    if (newValue && colorMode.preference !== newValue) {
      colorMode.preference = newValue
    }
  })

  // Watch for external changes to color mode and sync back
  watch(() => colorMode.preference, (newPreference) => {
    if (newPreference !== syncedColorMode.value) {
      syncedColorMode.value = newPreference as ColorMode
    }
  })

  return {
    colorMode: syncedColorMode,
  }
}
