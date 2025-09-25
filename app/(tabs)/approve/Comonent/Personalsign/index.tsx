import { useMemo } from 'react'
import { View } from 'react-native'
import { isHex } from 'viem'

import ThemedText from '@/components/UI/ThemedText'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { RequestWC } from '@/redux/slices/requestWC'

import styles from './styles'

const PersonalSign = ({ params }: { params: RequestWC }) => {
  const { wallets } = useWallets()
  const { background, colors } = useTheme()
  const message = useMemo(() => {
    let message = params?.params?.request.params[0]
    if (isHex(message)) {
      message = Buffer.from(message.replace('0x', ''), 'hex').toString()
    }
    return message
  }, [wallets, params])
  return (
    <View style={[styles.container, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <ThemedText>{message}</ThemedText>
    </View>
  )
}

export default PersonalSign
