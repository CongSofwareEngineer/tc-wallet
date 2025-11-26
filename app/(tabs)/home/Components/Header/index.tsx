import MyImage from '@/components/MyImage'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, MODE } from '@/constants/style'
import useChains from '@/hooks/useChains'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'
import { copyToClipboard, ellipsisText } from '@/utils/functions'
import { width } from '@/utils/systems'
import { AntDesign } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const HeaderHome = () => {
  const router = useRouter()
  const { wallet, indexWalletActive } = useWallets()
  const { chainCurrent } = useChains()
  const { mode } = useMode()

  const renderChainSelected = () => {
    return (
      <View style={[styles.containerChain, styles[`containerChain${mode}`]]}>
        <ThemeTouchableOpacity type='text' onPress={() => router.push('/select-chain')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
            {chainCurrent?.iconChain && <MyImage src={chainCurrent?.iconChain} style={{ width: 20, height: 20, borderRadius: 15 }} />}
            <ThemedText>{chainCurrent?.name}</ThemedText>
            <AntDesign name='down' size={width(4)} color='#FFFFFF' />
          </View>
        </ThemeTouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      <View style={styles.container}>
        <ThemeTouchableOpacity type='text' onPress={() => router.push('/wallet')}>
          <ThemedText type='subtitle'>
            {wallet?.name || `Account ${indexWalletActive}`}
            {` `} <AntDesign name='down' size={14} color='#FFFFFF' />
          </ThemedText>
        </ThemeTouchableOpacity>
        <ThemeTouchableOpacity type='text' onPress={() => router.push('/connect-dapp')}>
          <AntDesign name='scan' size={24} color='#FFFFFF' />
        </ThemeTouchableOpacity>
      </View>
      <View style={styles.container}>
        <ThemeTouchableOpacity type='text' onPress={() => copyToClipboard(wallet?.address || '')}>
          <ThemedText>
            <Ionicons name='copy-outline' size={14} />
            {` `}
            {ellipsisText(wallet?.address, 5, 6)}
          </ThemedText>
        </ThemeTouchableOpacity>
        {renderChainSelected()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerChain: {
    // borderWidth: 1,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius6,
    paddingHorizontal: 8,
  },
  [`containerChain${MODE.Light}`]: {
    borderColor: COLORS.gray,
  },
  [`containerChain${MODE.Dark}`]: {
    // borderColor: COLORS.gray,
    // backgroundColor: '#1d293d',
  },
})

export default HeaderHome
