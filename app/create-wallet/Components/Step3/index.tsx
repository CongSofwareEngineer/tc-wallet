import AntDesign from '@expo/vector-icons/AntDesign'
import { Checkbox } from 'expo-checkbox'
import { useRouter } from 'expo-router'
import React, { useMemo, useState, useTransition } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Hex } from 'viem'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, GAP_DEFAULT } from '@/constants/style'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import AllWalletUtils from '@/utils/allWallet'
import { cloneDeep } from '@/utils/functions'

type Props = {
  handleClose: () => void
  type?: 'passPhrase' | 'privateKey'
}

const Step3 = ({ handleClose, type = 'passPhrase' }: Props) => {
  const { colors, text } = useTheme()
  const [accepted, setAccepted] = useState(false)
  const [value, setValue] = useState('')

  const router = useRouter()
  const [isImporting, startImporting] = useTransition()
  const { setWallets, wallets } = useWallets()
  const { setPassPhrase } = usePassPhrase()

  const wordsCount = useMemo(() => {
    return value.trim().split(/\s+/).filter(Boolean).length
  }, [value])

  const isPkValid = useMemo(() => {
    const pk = value.trim()
    return /^(0x)?[0-9a-fA-F]{64}$/.test(pk)
  }, [value])

  const handleSubmit = async () => {
    startImporting(async () => {
      try {
        if (type === 'passPhrase') {
          const walletClone = cloneDeep(wallets)
          const wallet = await AllWalletUtils.createWalletFromPassPhrase(value.trim())
          await setPassPhrase(value.trim())
          walletClone.push(wallet)
          setWallets(walletClone)
          router.replace('/home')
        } else {
          const walletClone = cloneDeep(wallets)
          const wallet = await AllWalletUtils.createWalletFromPrivateKey(value.trim() as any)

          walletClone.push(wallet)
          setWallets(walletClone)
          router.replace('/home')
        }
      } catch (error) {
        const walletClone = cloneDeep(wallets)
        const wallet = await AllWalletUtils.createWalletFromPrivateKey(value.trim() as Hex)
        walletClone.push(wallet)
        setWallets(walletClone)
        router.replace('/home')
      }
    })
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.black3 }]}>
      <View style={{ flexDirection: 'row', gap: GAP_DEFAULT.Gap8, alignItems: 'center', marginBottom: 10 }}>
        <View>
          <AntDesign disabled={isImporting} onPress={handleClose} name='arrow-left' size={16} color={text.color} />
        </View>

        <ThemedText type='subtitle' style={styles.title}>
          Import Wallet
        </ThemedText>
      </View>

      <ThemedText style={[styles.subtitle, { color: text.color, opacity: 0.75 }]}>
        {type === 'passPhrase' ? ' Enter your seed phrase to restore your wallet' : 'Enter your private key to restore your wallet'}
      </ThemedText>

      {type === 'passPhrase' ? (
        <View style={{ gap: GAP_DEFAULT.Gap8 }}>
          <ThemedText type='defaultSemiBold'>Seed Phrase (12 words)</ThemedText>
          <View style={[styles.seedBox, { borderColor: colors.gray1 }]}>
            <TextInput
              style={[styles.textArea, { color: text.color }]}
              multiline
              placeholder='Enter your seed phrase...'
              placeholderTextColor={colors.gray2}
              value={value}
              onChangeText={setValue}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <View style={styles.sideTools}>
              {/* <ThemeTouchableOpacity style={styles.iconBtn} onPress={() => setSeedPhrase(seedPhrase.trim().toLowerCase())}>
                <ThemedText style={{ fontSize: 12 }}>🧪</ThemedText>
              </ThemeTouchableOpacity> */}
              <TouchableOpacity style={styles.iconBtn} onPress={() => setValue('')}>
                <ThemedText style={{ fontSize: 12 }}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          {!!value && (
            <ThemedText type='small' style={{ color: colors.yellow1 }}>
              {wordsCount} words • expecting 12
            </ThemedText>
          )}
        </View>
      ) : (
        <View style={{ gap: GAP_DEFAULT.Gap8 }}>
          <ThemedText type='defaultSemiBold'>Private Key (64 hex)</ThemedText>
          <View style={[styles.seedBox, { borderColor: colors.gray1 }]}>
            <TextInput
              style={[styles.singleLine, { color: text.color }]}
              placeholder='Enter your private key...'
              placeholderTextColor={colors.gray2}
              value={value}
              onChangeText={setValue}
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>
          {!!value && !isPkValid && (
            <ThemedText type='small' style={{ color: colors.yellow1 }}>
              Invalid private key format
            </ThemedText>
          )}
        </View>
      )}

      {/* Info box */}
      <View style={[styles.infoBox, { backgroundColor: colors.black2, borderColor: colors.gray1 }]}>
        <ThemedText type='small' opacity={0.8}>
          Your keys are encrypted and stored locally on your device.
        </ThemedText>
        <View style={styles.acceptRow}>
          <Checkbox value={accepted} onValueChange={setAccepted} color={accepted ? colors.green : undefined} />
          <ThemedText type='small' opacity={0.8}>
            I understand
          </ThemedText>
        </View>
      </View>

      {/* <LinearGradient
        colors={['#00d4ff', '#8b5cf6']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.importButtonGradient, !canSubmit && { opacity: 0.4 }]}
      >
        <ThemeTouchableOpacity
          disabled={!canSubmit || submitting}
          style={[styles.importButton, { backgroundColor: 'transparent' }]}
          onPress={handleSubmit}
          loading={submitting}
        >
          <ThemedText type='defaultSemiBold'>Import Wallet</ThemedText>
        </ThemeTouchableOpacity>
      </LinearGradient> */}
      <ThemeTouchableOpacity
        disabled={!accepted}
        style={[styles.importButton, { backgroundColor: 'transparent' }]}
        onPress={handleSubmit}
        loading={isImporting}
      >
        <ThemedText type='defaultSemiBold'>Import Wallet</ThemedText>
      </ThemeTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    gap: 18,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  tabs: {
    flexDirection: 'row',
    overflow: 'hidden',
    gap: GAP_DEFAULT.Gap12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  seedBox: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 120,
    padding: 12,
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
  },
  singleLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  sideTools: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    backgroundColor: '#0F151A',
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  acceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  importButtonGradient: {
    borderRadius: 12,
  },
  importButton: {
    borderRadius: 12,
  },
})

export default Step3
