import { PixelRatio } from 'react-native'

import { HEIGHT_SCREEN, WIDTH_SCREEN } from '@/constants/app'

export const height = (ratio = 100) => {
  return PixelRatio.roundToNearestPixel(HEIGHT_SCREEN * (ratio / 100))
}

export const width = (ratio = 100) => {
  return PixelRatio.roundToNearestPixel(WIDTH_SCREEN * (ratio / 100))
}
