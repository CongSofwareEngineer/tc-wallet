import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { PADDING_DEFAULT } from '@/constants/style'

import Step1 from './Components/Step1'
import ImportWallet from './Components/Step3'
import styles from './styles'

export default function ImportAccountPage() {
  const [step, setStep] = useState(1)

  const handleImportWalletWithSeedPhrase = () => {
    setStep(2)
  }

  const handleImportWalletWithPrivateKey = () => {
    setStep(3)
  }

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: PADDING_DEFAULT.Padding16,
      }}
    >
      <View style={styles.container}>
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
  )
}
