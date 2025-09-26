import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { GAP_DEFAULT } from '@/constants/style'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'

import styles from '../../styles'
type Props = {
  handleCreateWallet: () => void
  handleImportWalletWithPrivateKey: () => void
  handleImportWalletWithSeedPhrase: () => void
}

const Step1 = ({ handleCreateWallet, handleImportWalletWithPrivateKey, handleImportWalletWithSeedPhrase }: Props) => {
  const { mode } = useMode()
  const { text } = useTheme()

  return (
    <View style={[styles.containerContent, styles[`containerContent${mode}`]]}>
      <View style={{ alignItems: 'center', gap: GAP_DEFAULT.Gap12 }}>
        <ThemedText type='subtitle'>Tạo mới hoặc import</ThemedText>
        <View style={styles.containerLogo}>
          <AntDesign name='wallet' size={30} color={text.color} />
        </View>
        <ThemedText style={{ textAlign: 'center' }}>Welcome to Web3 Wallet</ThemedText>
        <ThemedText style={{ textAlign: 'center' }}>Create or import a wallet to get started with DeFi</ThemedText>
      </View>

      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleCreateWallet}>
          <ThemedText>Create Wallet</ThemedText>
        </ThemeTouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
        <View style={styles.line} />
        <ThemedText style={{ textAlign: 'center' }}>or</ThemedText>

        <View style={styles.line} />
      </View>

      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleImportWalletWithSeedPhrase}>
          <ThemedText>Import with Seed Phrase</ThemedText>
        </ThemeTouchableOpacity>
      </View>
      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleImportWalletWithPrivateKey}>
          <ThemedText>Import with Private Key</ThemedText>
        </ThemeTouchableOpacity>
      </View>
    </View>
  )
}

export default Step1
