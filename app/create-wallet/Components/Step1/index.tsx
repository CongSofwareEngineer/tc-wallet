import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { GAP_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
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
  const router = useRouter()
  const { translate } = useLanguage()

  return (
    <View style={[styles.containerContent, styles[`containerContent${mode}`]]}>
      <View style={{ alignItems: 'center', gap: GAP_DEFAULT.Gap12 }}>
        <ThemedText type='subtitle'>{translate('createWallet.title')}</ThemedText>
        <View style={styles.containerLogo}>
          <AntDesign name='wallet' size={30} color={text.color} />
        </View>
        <ThemedText style={{ textAlign: 'center' }}>{translate('createWallet.welcome')}</ThemedText>
        <ThemedText style={{ textAlign: 'center' }}>{translate('createWallet.description')}</ThemedText>
      </View>

      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleCreateWallet}>
          <ThemedText>{translate('createWallet.createButton')}</ThemedText>
        </ThemeTouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
        <View style={styles.line} />
        <ThemedText style={{ textAlign: 'center' }}>{translate('common.or')}</ThemedText>


        <View style={styles.line} />
      </View>

      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleImportWalletWithSeedPhrase}>
          <ThemedText>{translate('createWallet.importSeed')}</ThemedText>
        </ThemeTouchableOpacity>
      </View>
      <View>
        <ThemeTouchableOpacity style={styles.button} onPress={handleImportWalletWithPrivateKey}>
          <ThemedText>{translate('createWallet.importPrivateKey')}</ThemedText>
        </ThemeTouchableOpacity>
      </View>

      <View style={{ marginTop: GAP_DEFAULT.Gap8 }}>
        <ThemeTouchableOpacity style={styles.button} onPress={() => router.push('/restore')}>
          <ThemedText>{translate('createWallet.restoreFile')}</ThemedText>
        </ThemeTouchableOpacity>
      </View>
    </View>
  )
}

export default Step1
