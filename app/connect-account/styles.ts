import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'
import { width } from '@/utils/systems'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width(100),
    alignItems: 'center',
    padding: 16,
    gap: 5,
  },
  containerItem: {
    padding: 10,
    backgroundColor: COLORS.gray2,
    borderRadius: 8,
    gap: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
})

export default styles
