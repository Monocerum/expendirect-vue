export function readFileAsDataUrl(file, onLoad) {
    const reader = new FileReader()
    reader.onload = () => onLoad(reader.result)
    reader.readAsDataURL(file)
}