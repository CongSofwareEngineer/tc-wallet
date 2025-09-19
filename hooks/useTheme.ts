import { useMemo } from 'react'

import { generateBorderRadius, generateBorderWidth, generateFontSizes } from '@/configs/app'
import { BACKGROUND, COLORS, TEXT } from '@/constants/style'

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

  return {
    text,
    colors: COLORS,
    border,
    background: BACKGROUND[mode],
  }
}

export default useTheme
