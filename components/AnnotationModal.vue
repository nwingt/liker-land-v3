<template>
  <UModal
    v-model:open="open"
    class="max-w-[400px]"
    :ui="{
      body: [
        'flex',
        'flex-col',
        'items-start',
        'justify-center',
        'w-full',
        'py-6',
        'px-4',
        'gap-4',
        'rounded-xl',
      ],
      footer: [
        'flex',
        'gap-2',
        'w-full',
        'justify-between',
      ],
    }"
    :title="isNewAnnotation ? $t('reader_annotation_add_note') : $t('reader_annotation_edit_note')"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        class="w-full p-3 rounded-lg text-sm line-clamp-3"
        :style="{ backgroundColor: selectedColorRgba }"
        v-text="text"
      />

      <div class="flex gap-2 w-full justify-center">
        <button
          v-for="color in ANNOTATION_COLOR_OPTIONS"
          :key="color.value"
          class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="[
            selectedColor === color.value ? 'border-primary' : 'border-transparent',
          ]"
          :style="{ backgroundColor: color.rgba }"
          @click="selectedColor = color.value"
        />
      </div>

      <UTextarea
        v-model="note"
        class="w-full"
        :placeholder="$t('reader_annotation_note_placeholder')"
        variant="soft"
        autoresize
        :rows="3"
      />
    </template>

    <template #footer>
      <UButton
        v-if="annotation"
        color="error"
        variant="soft"
        :label="$t('reader_annotation_delete')"
        :loading="isDeleting"
        @click="handleDelete"
      />
      <div class="flex gap-2">
        <UButton
          color="neutral"
          variant="outline"
          :label="$t('reader_annotation_cancel')"
          @click="handleCancel"
        />
        <UButton
          color="primary"
          :label="$t('reader_annotation_save')"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ANNOTATION_COLOR_OPTIONS, ANNOTATION_COLORS_MAP } from '~/constants/annotations'

const props = defineProps<{
  annotation?: Annotation | null
  text: string
  initialColor: AnnotationColor
  isNewAnnotation?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: { color: AnnotationColor, note: string }): void
  (e: 'delete'): void
}>()

const { t: $t } = useI18n()
const open = defineModel<boolean>('open')

const selectedColor = ref<AnnotationColor>(props.initialColor)
const note = ref(props.annotation?.note || '')
const isSaving = ref(false)
const isDeleting = ref(false)

const selectedColorRgba = computed(() => {
  return ANNOTATION_COLORS_MAP[selectedColor.value]
})

watch(() => props.annotation, (newAnnotation) => {
  if (newAnnotation) {
    selectedColor.value = newAnnotation.color
    note.value = newAnnotation.note || ''
  }
  else {
    selectedColor.value = props.initialColor
    note.value = ''
  }
}, { immediate: true })

watch(() => props.initialColor, (newColor) => {
  if (!props.annotation) {
    selectedColor.value = newColor
  }
})

function handleCancel() {
  open.value = false
}

async function handleSave() {
  isSaving.value = true
  emit('save', {
    color: selectedColor.value,
    note: note.value,
  })
  // Keep loading state until modal is closed
}

async function handleDelete() {
  isDeleting.value = true
  emit('delete')
  // Keep loading state until modal is closed
}

// Reset loading states when modal closes
watch(open, (isOpen) => {
  if (!isOpen) {
    isSaving.value = false
    isDeleting.value = false
  }
})
</script>
