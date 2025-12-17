import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'

import styles from './styles'

const InfoWallet = () => {
  const { mode } = useMode()
  const { translate } = useLanguage()
  const { wallet } = useWallets()
  return (
    <View style={[styles.container, styles[`container${mode}`]]}>
      <ThemedText type='subtitle'>{translate('home.infoWallet.totalAssets')}</ThemedText>
    </View>
  )
}

export default InfoWallet
