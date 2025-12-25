import { BORDER_RADIUS_DEFAULT, COLORS, PADDING_DEFAULT } from '@/constants/style'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  cryptoList: {
    flex: 1,
    paddingHorizontal: PADDING_DEFAULT.Padding20,
  },
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: COLORS.grayDark,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
    position: 'relative',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius12 + 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    color: COLORS.whiteLight,
    fontWeight: '600',
    marginBottom: 2,
    flexShrink: 1,
    maxWidth: '95%',
  },
  cryptoBalance: {
    color: COLORS.gray,
    fontWeight: '400',
  },
  cryptoChange: {
    fontWeight: '500',
    textAlign: 'right',
  },
})

export default () => {}
