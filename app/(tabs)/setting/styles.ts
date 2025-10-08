import { StyleSheet } from 'react-native'

import { PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    gap: 10,
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: PADDING_DEFAULT.Padding16,
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
})

export default styles
