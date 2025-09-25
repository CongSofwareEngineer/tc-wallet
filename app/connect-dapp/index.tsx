import AntDesign from '@expo/vector-icons/AntDesign'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { IsIos } from '@/constants/app'
import useLanguage from '@/hooks/useLanguage'
import useRequestWC from '@/hooks/useReuestWC'
import useWallets from '@/hooks/useWallets'
import { sleep } from '@/utils/functions'
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
  const { setRequest } = useRequestWC()

  useEffect(() => {
    let instance: TypeWalletKit | null = null

    const onSessionProposal = async (e: any) => {
      setRequest({
        ...(e as any),
        timestamp: Date.now(),
        type: 'proposal',
      })
      setTimeout(() => {
        router.replace('/connect-account')
      }, 500)
    }

    const init = async () => {
      instance = await WalletKit.init()
      try {
        // pre-clean to avoid dev double-mount duplicates
        // @ts-ignore
        instance.off?.('session_proposal', onSessionProposal)
      } catch { }
      instance.on('session_proposal', onSessionProposal)
    }
    init()

    return () => {
      if (instance) {
        try {
          instance.off('session_proposal', onSessionProposal)
        } catch { }
      }
    }
  }, [wallet?.address, router])

  const handleConnect = async (uri = '') => {
    setLoading(true)
    const kit = await WalletKit.init()
    await sleep(500)
    await kit.pair({ uri })
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  const handleCopyPass = async () => {
    let text: any = await Clipboard.getStringAsync()
    if (IsIos && !text) {
      text = await Clipboard.getUrlAsync()
    }
    if (text && text.startsWith('wc:') && text?.includes('@2')) {
      setUri(text)
      handleConnect(text)
    }
  }

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
          if (!uri && data.startsWith('wc:') && data.includes('@2')) {
            setUri(data)
            setLoading(true)
            handleConnect(data)
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
