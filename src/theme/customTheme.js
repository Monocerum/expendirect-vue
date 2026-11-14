import { hueOf, mixColors, saturationOf } from '@/utils/color'

const BASE_GEAR_HUE = 338

export function buildCustomTheme({ primary, secondary, light }) {
    const strong = mixColors(primary, '#000', 0.55)
    const gearFilter =
        saturationOf(primary) < 0.15
            ? 'grayscale(1)'
            : `hue-rotate(${Math.round((hueOf(primary) - BASE_GEAR_HUE + 360) % 360)}deg)`
    const palette = {
        primary,
        'primary-dark': mixColors(primary, '#000', 0.35),
        'primary-light': light,
        secondary,
        'secondary-dark': mixColors(secondary, '#000', 0.35),
        ink: mixColors(primary, '#000', 0.8),
        'border-color': mixColors(light, primary, 0.12),
        'bg-end': mixColors(secondary, '#fff', 0.93),
        'header-start': mixColors(secondary, '#fff', 0.7),
        'header-end': mixColors(secondary, '#fff', 0.85),
        glow: mixColors(primary, '#fff', 0.7),
        blossom: mixColors(light, primary, 0.1),
        'primary-soft': mixColors(primary, '#fff', 0.35),
        'tint-primary': mixColors(light, '#fff', 0.5),
        'tint-secondary': mixColors(secondary, '#fff', 0.88),
        'text-strong': strong,
        'text-soft': mixColors(strong, '#fff', 0.35),
        'text-muted': mixColors(strong, '#fff', 0.45),
        'gear-filter': gearFilter,
    }
    return Object.fromEntries(Object.entries(palette).map(([name, value]) => [`--${name}`, value]))
}