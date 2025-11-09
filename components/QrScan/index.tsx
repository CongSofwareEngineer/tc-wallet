import { AntDesign } from '@expo/vector-icons'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import ThemedText from '@/components/UI/ThemedText'
import { IsIos } from '@/constants/app'
import { COLORS } from '@/constants/style'
import useSheet from '@/hooks/useSheet'
import { sleep } from '@/utils/functions'
import { isAddress } from '@/utils/nvm'
import WalletKit from '@/utils/walletKit'

type QrScanProps = {
  type?: 'address' | 'form' | 'connect'
  onScanned?: (data: string) => void
}

const QrScan = ({ type = 'connect', onScanned }: QrScanProps) => {
  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>('back')
  const [loading, setLoading] = useState(false)
  const [uri, setUri] = useState('')
  const { closeSheet } = useSheet()

  const handleScan = async (data: string) => {
    if (loading) return

    if (type === 'connect') {
      if (!uri && data.startsWith('wc:') && data.includes('@2')) {
        setUri(data)
        setLoading(true)
        try {
          const kit = await WalletKit.init()
          await sleep(500)
          await kit.pair({ uri: data })
        } catch (error) {
          console.log({ error })
          setLoading(false)
        }
      }
      return
    }

    // Validate data based on type
    let isValid = false
    switch (type) {
      case 'address':
        isValid = isAddress(data)

        break
      case 'form':
        try {
          const formData = JSON.parse(data)
          isValid = formData && typeof formData === 'object'
        } catch {
          isValid = false
        }
        break
    }

    if (isValid && onScanned) {
      onScanned(data)
      closeSheet()
    }
  }

  const toggleCameraType = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  const handleCopyPass = async () => {
    if (type !== 'connect') return

    let text: string | null = await Clipboard.getStringAsync()
    if (IsIos && !text) {
      text = await Clipboard.getUrlAsync()
    }
    if (text && text.startsWith('wc:') && text?.includes('@2')) {
      setUri(text)
      handleScan(text)
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.message}>Ứng dụng cần quyền truy cập camera để quét mã QR.</ThemedText>
        <ThemeTouchableOpacity type='primary' onPress={requestPermission} style={styles.button}>
          <ThemedText style={styles.text}>Cấp quyền Camera</ThemedText>
        </ThemeTouchableOpacity>
        <ThemeTouchableOpacity type='text' onPress={() => closeSheet()}>
          <ThemedText>Back</ThemedText>
        </ThemeTouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => handleScan(data)}
      >
        <View style={styles.overlay}>
          <View style={styles.buttonContainer}>
            {/* <ThemeTouchableOpacity type='text' onPress={() => closeSheet()} style={styles.button}>
              <ThemedText style={styles.text}>Back</ThemedText>
            </ThemeTouchableOpacity> */}
            <View />

            <ThemeTouchableOpacity type='text' onPress={toggleCameraType} style={styles.button}>
              <AntDesign name='retweet' size={24} color={COLORS.white} />
            </ThemeTouchableOpacity>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>

          <ThemedText style={styles.instructions}>
            {type === 'address' ? 'Scan wallet address' : type === 'form' ? 'Scan QR form' : 'Scan WalletConnect QR code'}
          </ThemedText>

          {type === 'connect' && (
            <View style={styles.buttonContainerPass}>
              <ThemedText style={styles.pasteText}>Hoặc dán link kết nối</ThemedText>
              <ThemeTouchableOpacity type='text' onPress={handleCopyPass}>
                <AntDesign name='link' size={24} color={COLORS.white} />
              </ThemeTouchableOpacity>
            </View>
          )}
        </View>
      </CameraView>

      {loading && (
        <View style={styles.containerLoading}>
          <MyLoading size={55} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  scanArea: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: COLORS.green600,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: COLORS.green600,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.green600,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.green600,
  },
  instructions: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  buttonContainerPass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 'auto',
  },
  pasteText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  containerLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default QrScan
