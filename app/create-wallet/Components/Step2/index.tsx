import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemeCheckBox from '@/components/UI/ThemeCheckBox'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { copyToClipboard, sleep } from '@/utils/functions'
import PassPhase from '@/utils/passPhare'
import { width } from '@/utils/systems'

import styles from '../../styles'

import AllWalletUtils from '@/utils/allWallet'
import { Ionicons } from '@expo/vector-icons'
import stylesCustom from './styles'
type Props = {
  handleClose: () => void
}
const Step2 = ({ handleClose }: Props) => {
  const [passPhrase, setPassPhrase] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { mode } = useMode()
  const { text } = useTheme()
  const { translate } = useLanguage()
  const { setWallets } = useWallets()
  const { passPhase: passPhaseList, setPassPhrase: setPassPhraseLocal } = usePassPhrase()
  // Removed debug log to satisfy lint rules

  const handleCreatePassPhrase = async () => {
    setLoading(true)
    await sleep(500)

    const createdPassPhrase = await PassPhase.getMnemonic(passPhaseList.length, false)
    setPassPhrase(createdPassPhrase)
    setIsShow(true)
    setLoading(false)
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    await sleep(500)

    await setPassPhraseLocal(passPhrase)
    const wallet = await AllWalletUtils.createWallet(0, 0)
    setWallets([wallet])
    router.replace('/home')
    setLoading(false)
  }

  console.log({ loading });


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
              <ThemedText style={[stylesCustom.cellIndex, { color: text.color, fontSize: 12 }]}>{globalIndex + 1}.</ThemedText>
              <ThemedText style={[stylesCustom.cellWord, { color: text.color, fontSize: 12 }]}>{hidden ? '----' : word}</ThemedText>
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={[styles.containerContent, styles[`containerContent${mode}`], { maxWidth: width(100) - PADDING_DEFAULT.Padding20 * 2 }]}>
        {/* <View style={{ gap: GAP_DEFAULT.Gap16, width: '100%', maxWidth: width(96), padding: 20, backgroundColor: 'green' }}> */}
        <View style={{ flexDirection: 'row', gap: GAP_DEFAULT.Gap8, alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity disabled={loading} onPress={handleClose}>
            <AntDesign disabled={loading} name='arrow-left' size={16} color={text.color} />
          </TouchableOpacity>

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
                    }}
                    style={{ flex: 1, alignItems: 'center' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                      <Ionicons name='copy-outline' size={16} color={text.color} />
                      <ThemedText>{translate('common.copy')}</ThemedText>
                    </View>
                  </ThemeTouchableOpacity>
                  <ThemeTouchableOpacity onPress={() => setHidden(!hidden)}>
                    <View style={{ flexDirection: 'row', width: 40, flex: 1, alignItems: 'center', justifyContent: 'center', gap: GAP_DEFAULT.Gap8 }}>
                      <ThemedText>
                        <AntDesign name={hidden ? 'eye' : 'eye-invisible'} size={20} color={text.color} />
                      </ThemedText>
                    </View>
                  </ThemeTouchableOpacity>
                </View>
              </>
            ) : (
              <View style={stylesCustom.containerShow}>
                {loading ? (
                  <MyLoading />
                ) : (
                  <TouchableOpacity onPress={() => handleCreatePassPhrase()}>
                    <AntDesign name='eye' size={30} color={text.color} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
        {isShow && (
          <>
            <ThemeTouchableOpacity type='text' style={{ padding: 0 }} activeOpacity={1} onPress={() => setAgree(!agree)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>

                <ThemeCheckBox value={agree} />
                <ThemedText>I have safely backed up my seed phrase</ThemedText>
              </View>
            </ThemeTouchableOpacity>
            <ThemeTouchableOpacity
              onPress={handleCreateAccount}
              loading={loading}
              disabled={!agree}
              style={{ opacity: agree ? 1 : 0.5, alignItems: 'center' }}
            >
              <ThemedText>Create Account</ThemedText>
            </ThemeTouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

export default Step2
