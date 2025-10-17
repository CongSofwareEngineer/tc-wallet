import { useMemo } from 'react'

import { generateBorderRadius, generateBorderWidth, generateFontSizes } from '@/configs/app'
import { BACKGROUND, COLOR_ICON, COLORS, TEXT } from '@/constants/style'

import useMode from './useMode'

const useTheme = () => {
  const { mode } = useMode()

  const text = useMemo(() => {
    return {
      ...generateFontSizes(),
      ...TEXT[mode],
    }
  }, [mode])

  const border = useMemo(() => {
    return {
      ...generateBorderRadius(),
      ...generateBorderWidth(),
    }
  }, [])

  const colorIcon = useMemo(() => {
    return COLOR_ICON[mode]
  }, [mode])

  return {
    colorIcon,
    text,
    colors: COLORS,
    border,
    background: BACKGROUND[mode],
  }
}

export default useTheme
