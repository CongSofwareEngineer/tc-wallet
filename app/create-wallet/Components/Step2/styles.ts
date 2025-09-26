import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  containerWarning: {
    flexDirection: 'row',
    gap: GAP_DEFAULT.Gap8,
    borderWidth: 1,
    borderColor: '#FFA500',
    padding: PADDING_DEFAULT.Padding12,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
  },
  containerShow: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPassPhrase: {
    flexDirection: 'column',
    gap: GAP_DEFAULT.Gap8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flexBasis: '48%',
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: '#555',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP_DEFAULT.Gap4,
  },
  cellIndex: {
    opacity: 0.6,
    fontSize: 11,
  },
  cellWord: {
    flexShrink: 1,
  },
})

export default styles
