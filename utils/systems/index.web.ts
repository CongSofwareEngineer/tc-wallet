import { HEIGHT_SCREEN, WIDTH_SCREEN } from '@/constants/app'

export const height = (ratio = 100) => {
  return Math.round(HEIGHT_SCREEN * (ratio / 100))
}

export const width = (ratio = 100) => {
  if (WIDTH_SCREEN > 500) {
    return Math.round(500 * (ratio / 100))
  }
  return Math.round(WIDTH_SCREEN * (ratio / 100))
}

export const downloadFile = (fileName: string, value: any) => {
  const blob = new Blob([value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
