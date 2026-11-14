import { buildCustomTheme } from './customTheme'
import { THEMES } from './themes'

export function applyTheme(themeId, customColors) {
    const variables =
        themeId === 'custom' && customColors
            ? buildCustomTheme(customColors)
            : (THEMES.find((theme) => theme.id === themeId) ?? THEMES[0]).vars
    Object.entries(variables).forEach(([name, value]) => {
        document.documentElement.style.setProperty(name, value)
    })
}