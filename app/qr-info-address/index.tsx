import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { Linking, ScrollView, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, GAP_DEFAULT } from '@/constants/style'
import { useAlert } from '@/hooks/useAlert'
import useChains from '@/hooks/useChains'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'
import { copyToClipboard, ellipsisText } from '@/utils/functions'

import { images } from '@/configs/images'
import { createStyles } from './styles'

const QRInfoAddressScreen = () => {
  const { isDark } = useMode()
  const { showSuccess } = useAlert()
  const { chainCurrent } = useChains()
  const { wallet } = useWallets()
  const { translate } = useLanguage()
  const styles = createStyles(isDark)

  const [activeTab, setActiveTab] = useState<'scan' | 'receive'>('receive')

  // Mock data - trong thực tế sẽ lấy từ selected wallet và chain

  const handleCopyAddress = async () => {
    try {
      copyToClipboard(wallet?.address || '', true)
    } catch {
      showSuccess({ text: translate('receive.msg.copyFail') })
    }
  }

  const handleOpenExplorer = () => {
    if (!chainCurrent?.blockExplorers?.default?.url || !wallet?.address) return
    const url = `${chainCurrent.blockExplorers.default.url}/address/${wallet.address}`
    Linking.openURL(url)
  }



  const renderQRSection = () => (
    <View style={styles.qrSection}>
      <View style={styles.qrContainer}>
        <QRCode
          value={wallet?.address || ''}
          size={250}
          backgroundColor='transparent'
          color={isDark ? '#FFFFFF' : '#000000'}
          logo={images.logo}
          logoSize={40}
          logoBackgroundColor='#FFFFFF'
        />
      </View>

      <ThemedText style={styles.addressLabel}>{ellipsisText(wallet?.address || '', 6, 6)}</ThemedText>

      <ThemedText style={styles.fullAddress}>{wallet?.address || ''}</ThemedText>

      <View style={{ flexDirection: 'row', gap: GAP_DEFAULT.Gap8, justifyContent: 'center' }}>
        <ThemeTouchableOpacity type='outline' style={styles.copyButton} onPress={handleCopyAddress}>
          <Ionicons name='copy-outline' size={16} color={COLORS.green600} />
          <ThemedText numberOfLines={1} style={styles.copyButtonText}>
            {translate('receive.copyAddress')}
          </ThemedText>
        </ThemeTouchableOpacity>

        {chainCurrent?.blockExplorers?.default && (
          <ThemeTouchableOpacity type='outline' style={styles.copyButton} onPress={handleOpenExplorer}>
            <Ionicons name='open-outline' size={16} color={COLORS.green600} />
            <ThemedText numberOfLines={1} style={styles.copyButtonText}>
              {translate('receive.viewOnExplorer')}
            </ThemedText>
          </ThemeTouchableOpacity>
        )}
      </View>
    </View>
  )

  const renderScanSection = () => (
    <View style={styles.scanSection}>
      <ThemedText style={styles.scanTitle}>{translate('receive.scanTitle')}</ThemedText>
      <ThemedText style={styles.scanSubtitle}>{translate('receive.scanSubtitle')}</ThemedText>
      <ThemeTouchableOpacity
        style={styles.openCameraButton}

      >
        <Ionicons name='camera-outline' size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        <ThemedText style={styles.openCameraText}>{translate('receive.openCamera')}</ThemedText>
      </ThemeTouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <HeaderScreen title={translate('receive.title')} />

      <ScrollView contentContainerStyle={styles.content} style={styles.content}>
        {/* Tab Buttons */}
        {/* <View style={styles.tabContainer}>
          {renderTabButton('scan', 'Scan QR code')}
          {renderTabButton('receive', 'Your QR code')}
        </View> */}

        {/* Content */}
        <View style={[{ flexDirection: 'row', marginVertical: 20, alignItems: 'center', justifyContent: 'center', gap: GAP_DEFAULT.Gap8 }]}>
          {chainCurrent?.iconChain && <Image source={{ uri: chainCurrent?.iconChain }} style={{ width: 30, height: 30, borderRadius: 18 }} />}
          <ThemedText type='subtitle'>{chainCurrent?.name}</ThemedText>
        </View>
        <View style={styles.contentContainer}>{activeTab === 'receive' ? renderQRSection() : renderScanSection()}</View>

        {/* Request Payment Button */}
        {/* {activeTab === 'receive' && (
          <View style={styles.bottomSection}>
            <ThemeTouchableOpacity style={styles.requestButton} onPress={handleRequestPayment}>
              <ThemedText style={styles.requestButtonText}>Request Payment</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        )} */}
      </ScrollView>
    </View>
  )
}

export default QRInfoAddressScreen
