import { HEIGHT_SCREEN, WIDTH_SCREEN } from '@/constants/app'

export const height = (ratio = 100) => {
  return Math.round(HEIGHT_SCREEN * (ratio / 100))
}

export const width = (ratio = 100) => {
  return Math.round(WIDTH_SCREEN * (ratio / 100))
}
