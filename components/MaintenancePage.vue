<template>
  <div class="flex items-center justify-center min-h-svh p-5 laptop:p-12">
    <UCard
      :ui="{
        root: 'ring-theme-500 ring-2',
        header: 'bg-theme-500',
      }"
    >
      <template #header>
        <AppLogo
          class="max-w-xs mx-auto"
          height="auto"
        />
      </template>
      <h1
        class="text-2xl font-bold text-center animate-pulse"
        v-text="$t('maintenance_page_title')"
      />
      <p
        class="mt-4"
        v-text="$t('maintenance_page_description')"
      />
    </UCard>
  </div>
</template>
