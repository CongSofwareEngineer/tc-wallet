import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { COLORS } from '@/constants/style'

const Items = ({ children }: { children: ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    borderWidth: 1,
  },
})
export default Items
