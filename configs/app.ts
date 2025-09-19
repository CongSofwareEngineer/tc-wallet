import { BORDER_RADIUS, BORDER_WIDTH, TEXT_SIZE } from '@/constants/style'
import { BorderRadius, BorderWidth, FontSizes } from '@/types/styles'

export const generateFontSizes = () => {
  return TEXT_SIZE.reduce((acc, size) => {
    return Object.assign(acc, {
      [`size_${size}`]: {
        fontSize: size,
      },
    })
  }, {} as FontSizes)
}

export const generateBorderRadius = () => {
  return BORDER_RADIUS.reduce((acc, radius) => {
    return Object.assign(acc, {
      [`radius_${radius}`]: {
        borderRadius: radius,
      },
    })
  }, {} as BorderRadius)
}

export const generateBorderWidth = () => {
  return BORDER_WIDTH.reduce((acc, width) => {
    return Object.assign(acc, {
      [`width_${width}`]: {
        borderWidth: width,
      },
    })
  }, {} as BorderWidth)
}
