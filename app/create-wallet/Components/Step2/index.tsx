import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React, { useState, useTransition } from 'react'
import { Alert, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemeCheckBox from '@/components/UI/ThemeCheckBox'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { GAP_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import AllWalletUtils from '@/utils/allWallet'
import { copyToClipboard } from '@/utils/functions'
import PassPhase from '@/utils/passPhare'

import styles from '../../styles'

import stylesCustom from './styles'
type Props = {
  handleClose: () => void
}
const Step2 = ({ handleClose }: Props) => {
  const [passPhrase, setPassPhrase] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [agree, setAgree] = useState(false)

  const router = useRouter()
  const { mode } = useMode()
  const { text } = useTheme()
  const { translate } = useLanguage()
  const { setWallets } = useWallets()
  const { passPhase: passPhaseList, setPassPhrase: setPassPhraseLocal } = usePassPhrase()
  const [isCreating, startCreating] = useTransition()
  const [isCreatingAccount, startCreatingAccount] = useTransition()
  // Removed debug log to satisfy lint rules

  const handleCreatePassPhrase = async () => {
    startCreating(async () => {
      const createdPassPhrase = await PassPhase.getMnemonic(passPhaseList.length, false)
      setPassPhrase(createdPassPhrase)
      setIsShow(true)
    })
  }

  const handleCreateAccount = async () => {
    startCreatingAccount(async () => {
      await setPassPhraseLocal(passPhrase)
      const wallet = await AllWalletUtils.createWallet(0, 0)
      setWallets([wallet])
      router.replace('/home')
    })
  }

  const renderPassPhrase = () => {
    if (!passPhrase) return null
    const words = passPhrase.trim().split(/\s+/)
    const rows: string[][] = []
    for (let i = 0; i < words.length; i += 2) {
      rows.push(words.slice(i, i + 2))
    }
    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={stylesCustom.tableRow}>
        {row.map((word, colIndex) => {
          const globalIndex = rowIndex * 2 + colIndex
          return (
            <View key={`cell-${globalIndex}`} style={stylesCustom.cell}>
              <ThemedText style={[stylesCustom.cellIndex, { color: text.color }]}>{globalIndex + 1}.</ThemedText>
              <ThemedText style={[stylesCustom.cellWord, { color: text.color }]}>{hidden ? '----' : word}</ThemedText>
            </View>
          )
        })}
        {row.length < 2 &&
          Array.from({ length: 2 - row.length }).map((_, fillerIdx) => (
            <View key={`filler-${rowIndex}-${fillerIdx}`} style={[stylesCustom.cell, { opacity: 0 }]} />
          ))}
      </View>
    ))
  }

  return (
    <View style={[styles.containerContent, styles[`containerContent${mode}`]]}>
      <View style={{ flexDirection: 'row', gap: GAP_DEFAULT.Gap8, alignItems: 'center', marginBottom: 10 }}>
        <View>
          <AntDesign disabled={isCreatingAccount} onPress={handleClose} name='arrow-left' size={16} color={text.color} />
        </View>

        <ThemedText>Backup Your Seed Phrase</ThemedText>
      </View>
      <ThemedText>Write down these 12 words in order. You&apos;ll need them to recover your wallet.</ThemedText>
      <View style={stylesCustom.containerWarning}>
        <AntDesign name='warning' size={20} color={text.color} />
        <ThemedText type='small'>Never share your seed phrase. Anyone with these words can access your wallet.</ThemedText>
      </View>
      <View>
        <View style={[styles.containerContent, styles[`containerContent${mode}`]]}>
          {isShow ? (
            <>
              <View style={stylesCustom.containerPassPhrase}>{renderPassPhrase()}</View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                <ThemeTouchableOpacity
                  onPress={() => {
                    copyToClipboard(passPhrase)
                    Alert.alert('Copied')
                  }}
                  style={{ flex: 1 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                    <AntDesign name='copy' size={16} color={text.color} />
                    <ThemedText>{translate('common.copy')}</ThemedText>
                  </View>
                </ThemeTouchableOpacity>
                <ThemeTouchableOpacity>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                    <AntDesign name={hidden ? 'eye' : 'eye-invisible'} size={16} color={text.color} onPress={() => setHidden(!hidden)} />
                  </View>
                </ThemeTouchableOpacity>
              </View>
            </>
          ) : (
            <View style={stylesCustom.containerShow}>
              {isCreating ? <MyLoading /> : <AntDesign name='eye' size={30} color={text.color} onPress={() => handleCreatePassPhrase()} />}
            </View>
          )}
        </View>
      </View>
      {isShow && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
            <ThemeCheckBox disabled={isCreatingAccount} value={agree} onValueChange={setAgree} />
            <ThemedText>I have safely backed up my seed phrase</ThemedText>
          </View>
          <ThemeTouchableOpacity loading={isCreatingAccount} disabled={!agree} style={{ opacity: agree ? 1 : 0.5 }}>
            <ThemedText onPress={handleCreateAccount}>Create Account</ThemedText>
          </ThemeTouchableOpacity>
        </>
      )}
    </View>
  )
}

export default Step2
