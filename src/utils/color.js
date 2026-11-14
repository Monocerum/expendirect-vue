const clampByte = (value) => Math.round(Math.max(0, Math.min(255, value)))

export function hexToRgb(hex) {
    const digits = hex.replace('#', '')
    const full = digits.length === 3 ? [...digits].map((c) => c + c).join('') : digits
    const value = parseInt(full, 16)
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export const rgbToHex = (channels) =>
    `#${channels.map((c) => clampByte(c).toString(16).padStart(2, '0')).join('')}`

export function mixColors(from, to, amount) {
    const a = hexToRgb(from)
    const b = hexToRgb(to)
    return rgbToHex(a.map((channel, index) => channel + (b[index] - channel) * amount))
}

export function hueOf(hex) {
    const [r, g, b] = hexToRgb(hex).map((c) => c / 255)
    const max = Math.max(r, g, b)
    const delta = max - Math.min(r, g, b)
    if (!delta) return 0
    let hue
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
    return (hue * 60 + 360) % 360
}

export function saturationOf(hex) {
    const [r, g, b] = hexToRgb(hex).map((c) => c / 255)
    const max = Math.max(r, g, b)
    return max ? (max - Math.min(r, g, b)) / max : 0
}

function relativeLuminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((channel) => {
        const value = channel / 255
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrastWithWhite = (hex) => 1.05 / (relativeLuminance(hex) + 0.05)

export function readableTextColor(background) {
    const [r, g, b] = hexToRgb(background)
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#3a1020' : '#fff'
}