/**
 * Base annotation color RGB values from Tailwind 600-shade colors
 */
const ANNOTATION_COLOR_RGB: Record<AnnotationColor, string> = {
  yellow: '202, 138, 4',
  red: '220, 38, 38',
  green: '22, 163, 74',
  blue: '37, 99, 235',
}

/**
 * Valid annotation color values for validation
 */
export const ANNOTATION_COLORS = Object.keys(ANNOTATION_COLOR_RGB) as AnnotationColor[]

/**
 * Helper function to create rgba color string with specified opacity
 */
function createAnnotationColorMap(opacity: number): Record<AnnotationColor, string> {
  return ANNOTATION_COLORS.reduce((acc, color) => {
    acc[color] = `rgba(${ANNOTATION_COLOR_RGB[color]}, ${opacity})`
    return acc
  }, {} as Record<AnnotationColor, string>)
}

/**
 * Annotation highlight colors with 40% opacity for text highlighting
 */
export const ANNOTATION_COLORS_MAP = createAnnotationColorMap(0.4)

/**
 * Annotation color indicators with 80% opacity for UI elements (dots, badges)
 */
export const ANNOTATION_INDICATOR_COLORS_MAP = createAnnotationColorMap(0.8)

/**
 * Array of annotation colors with their rgba values for UI rendering
 */
export const ANNOTATION_COLOR_OPTIONS: Array<{ value: AnnotationColor, rgba: string }>
  = ANNOTATION_COLORS.map(color => ({
    value: color,
    rgba: ANNOTATION_COLORS_MAP[color],
  }))
