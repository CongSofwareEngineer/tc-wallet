import AntDesign from '@expo/vector-icons/AntDesign'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { IsIos } from '@/constants/app'
import useLanguage from '@/hooks/useLanguage'
import { sleep } from '@/utils/functions'
import WalletKit from '@/utils/walletKit'

import styles from './styles'

type Props = {
  type?: 'connect' | 'address' | 'form'
}

const ConnectDAppScreen = ({ type = 'connect' }: Props) => {
  const router = useRouter()
  const [uri, setUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [facing, setFacing] = useState<CameraType>('back')

  const [permission, requestPermission] = useCameraPermissions()
  const { translate } = useLanguage()

  const handleScan = (data: any) => {
    if (type === 'connect') {
      if (!uri && data.startsWith('wc:') && data.includes('@2')) {
        setUri(data)
        setLoading(true)
        handleConnect(data)
      }
      return
    }
  }

  const handleConnect = async (uri = '') => {
    try {
      setLoading(true)
      const kit = await WalletKit.init()
      console.log({ kit, uri })

      await sleep(500)
      await kit.pair({ uri })
    } catch (error) {
      console.log({ error })
    }
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
          handleScan(data)
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
      {type === 'connect' && (
        <>
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
        </>
      )}

      {loading ? (
        <View style={styles.containerLoading}>
          <MyLoading size={55} />
        </View>
      ) : null}
    </View>
  )
}

export default ConnectDAppScreen
