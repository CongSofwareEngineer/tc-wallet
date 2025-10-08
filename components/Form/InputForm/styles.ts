import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 5,
  },
  controller: {
    width: '100%',
  },
  error: {
    color: COLORS.red,
  },
})

export default styles
