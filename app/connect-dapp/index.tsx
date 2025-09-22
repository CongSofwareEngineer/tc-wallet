import AntDesign from '@expo/vector-icons/AntDesign'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { IsIos } from '@/constants/app'
import useLanguage from '@/hooks/useLanguage'
import useWallets from '@/hooks/useWallets'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

import styles from './styles'

const ConnectDAppScreen = () => {
  const router = useRouter()
  const { wallet } = useWallets()
  const [uri, setUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [facing, setFacing] = useState<CameraType>('back')

  const [permission, requestPermission] = useCameraPermissions()
  const { translate } = useLanguage()

  useEffect(() => {
    let walletKit: TypeWalletKit
    const initData = async () => {
      console.log('initData')

      walletKit = await WalletKit.init()

      walletKit.on('session_proposal', async (e) => {
        const { id, params } = e
        const nameSpaces = WalletKit.formatNameSpaceBySessions(params as any, wallet?.address || '')
        await WalletKit.onSessionProposal(id, params, nameSpaces)

        setTimeout(() => {
          setUri('')
          setLoading(false)
          router.back()
        }, 500)
      })
    }
    if (permission?.granted) {
      initData()
    }

    return () => {
      console.log('cleanup')

      if (walletKit) {
        walletKit?.off('session_proposal', () => { })
      }
    }
  }, [permission?.granted, wallet, router])

  const handleConnect = useCallback(async () => {
    const walletKit = await WalletKit.init()
    await walletKit.core.pairing.pair({ uri })
  }, [uri])

  useEffect(() => {
    if (uri && uri.startsWith('wc:') && uri?.includes('@2')) {
      handleConnect()
    }
  }, [uri, handleConnect])

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  const handleCopyPass = async () => {
    let text: any = await Clipboard.getStringAsync()

    if (IsIos && !text) {
      text = await Clipboard.getUrlAsync()
    }
    console.log({ text })

    if (text && text.startsWith('wc:') && text?.includes('@2')) {
      setUri(text)
    }
  }
  // Show a simple permission gate UI until camera access is granted
  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, gap: 10, justifyContent: 'center' }}>
        <ThemedText style={styles.message}>Ứng dụng cần quyền truy cập camera để quét mã QR.</ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.text}>Cấp quyền Camera</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText>{translate('common.back')}</ThemedText>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        mode='picture'
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => {
          if (!uri) {
            setUri(data)
            setLoading(true)
          }
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <ThemedText style={styles.text}>Back</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <AntDesign name='retweet' size={24} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainerPass}>
        <ThemedText
          style={{
            flex: 1,
            color: 'white',
            fontSize: 16,
          }}
        >
          Hoặc dán link kết nối
        </ThemedText>
        <TouchableOpacity onPress={handleCopyPass}>
          <AntDesign name='link' size={24} color='white' />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.containerLoading}>
          <MyLoading size={55} />
        </View>
      ) : null}
    </View>
  )
}

export default ConnectDAppScreen
