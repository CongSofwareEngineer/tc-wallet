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
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerContentlight: {
    backgroundColor: BACKGROUND.light.background,
  },
  containerContentdark: {
    backgroundColor: 'transparent',
  },
  item: {
    width: '45%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: PADDING_DEFAULT.Padding12,
    borderRadius: BORDER_RADIUS[2],
    borderWidth: 1,
    gap: GAP_DEFAULT.Gap12,
  },
  itemContent: {
    alignItems: 'center',
    gap: GAP_DEFAULT.Gap8,
  },
  flag: {
    fontSize: 40,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
})

export default styles
