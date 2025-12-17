import { StyleSheet } from 'react-native'

import { BACKGROUND, BORDER_RADIUS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    padding: PADDING_DEFAULT.Padding16,
    gap: GAP_DEFAULT.Gap16,
  },
  containerContentlight: {
    backgroundColor: BACKGROUND.light.background,
  },
  containerContentdark: {
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING_DEFAULT.Padding12,
    borderRadius: BORDER_RADIUS[2],
    borderWidth: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP_DEFAULT.Gap12,
  },
  flag: {
    fontSize: 24,
  },
})

export default styles
