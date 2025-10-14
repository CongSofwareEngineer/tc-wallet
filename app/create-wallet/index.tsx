import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { PADDING_DEFAULT } from '@/constants/style'

import Step1 from './Components/Step1'
import Step2 from './Components/Step2'
import Step3 from './Components/Step3'
import styles from './styles'

const CreateWalletScreen = () => {
  const [step, setStep] = useState(1)

  const handleImportWalletWithPrivateKey = () => {
    setStep(4)
  }

  const handleImportWalletWithSeedPhrase = () => {
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

        {step === 2 && <Step2 handleClose={() => setStep(1)} />}
        {step === 3 && <Step3 handleClose={() => setStep(1)} />}
        {step === 4 && <Step3 type='privateKey' handleClose={() => setStep(1)} />}
      </View>
    </ScrollView>
  )
}

export default CreateWalletScreen
