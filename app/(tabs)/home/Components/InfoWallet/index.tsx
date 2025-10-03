import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'

import styles from './styles'

const InfoWallet = () => {
  const { mode } = useMode()
  const { wallet } = useWallets()
  return (
    <View style={[styles.container, styles[`container${mode}`]]}>
      <ThemedText type='subtitle'>Tổng tài sản</ThemedText>
    </View>
  )
}

export default InfoWallet
