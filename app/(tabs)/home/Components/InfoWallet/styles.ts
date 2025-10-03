import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, MODE, PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    padding: PADDING_DEFAULT.Padding16,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
    gap: GAP_DEFAULT.Gap8,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  [`container${MODE.Dark}`]: {
    backgroundColor: COLORS.gray2,
  },
  [`container${MODE.Light}`]: {
    backgroundColor: COLORS.white,
  },
})

export default styles
