import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import { PADDING_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import { useRouter } from 'expo-router'
import Step1 from './Components/Step1'
import ImportWallet from './Components/Step3'
import styles from './styles'

export default function ImportAccountScreen() {
  const [step, setStep] = useState(1)
  const { mode } = useMode()
  const { text } = useTheme()
  const router = useRouter()
  const { translate } = useLanguage()

  const handleImportWalletWithSeedPhrase = () => {
    setStep(2)
  }

  const handleImportWalletWithPrivateKey = () => {
    setStep(3)
  }

  return (
    <KeyboardAvoiding>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          // padding: PADDING_DEFAULT.Padding16,
        }}
      >
        <HeaderScreen title={translate('importAccount.title')} />
        <View style={[styles.container, { padding: PADDING_DEFAULT.Padding16 }]}>
          {step === 1 && (
            <Step1
              handleCreateWallet={() => setStep(2)}
              handleImportWalletWithPrivateKey={handleImportWalletWithPrivateKey}
              handleImportWalletWithSeedPhrase={handleImportWalletWithSeedPhrase}
            />
          )}
          {step === 2 && <ImportWallet handleClose={() => setStep(1)} />}
          {step === 3 && <ImportWallet type='privateKey' handleClose={() => setStep(1)} />}
        </View>
      </ScrollView>
    </KeyboardAvoiding>
  )
}
