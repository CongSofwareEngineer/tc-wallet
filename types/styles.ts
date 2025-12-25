import { BORDER_RADIUS, BORDER_WIDTH, TEXT_SIZE } from '@/constants/style'
export type ArrayValue<T extends readonly unknown[]> = T[number]

type FontSizesKeys = `size_${ArrayValue<typeof TEXT_SIZE>}`
type BorderRadiusKeys = `radius_${ArrayValue<typeof BORDER_RADIUS>}`
type BorderWidthKeys = `width_${ArrayValue<typeof BORDER_WIDTH>}`

export type FontSizes = {
  [key in FontSizesKeys]: {
    fontSize: number
  }
}

export type BorderRadius = {
  [key in BorderRadiusKeys]: {
    borderRadius: number
  }
}

export type BorderWidth = {
  [key in BorderWidthKeys]: {
    borderWidth: number
  }
}

export default () => {}
