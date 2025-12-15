import { BORDER_RADIUS_DEFAULT, COLORS, PADDING_DEFAULT } from '@/constants/style'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'
import { ellipsisText, getRadomColor } from '@/utils/functions'
import { height } from '@/utils/systems'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ThemedText from '../UI/ThemedText'
type Props = {
  value?: Wallet
  onPress: (w: Wallet) => void
}
const SelectAccount = ({ value, onPress }: Props) => {
  const { wallets } = useWallets()
  const { isDark } = useMode()

  const styles = createStyles(isDark)

  return (
    <View>
      <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
        Chọn địa chỉ từ ví của tôi
      </ThemedText>

      <ScrollView style={{ maxHeight: height(60) }}>
        {[...wallets].map((w, index) => {
          const isSelected = value?.address === w.address
          return (
            <TouchableOpacity
              key={w.address + index}
              style={[styles.tokenItem, isSelected && styles.tokenItemSelected]}
              onPress={() => onPress(w)}
            >
              <View style={[styles.tokenIcon, { backgroundColor: getRadomColor(w?.address) }]} />
              <View style={styles.tokenItemContent}>
                <ThemedText style={styles.tokenItemSymbol}>{w.name || 'Account'}</ThemedText>
                <ThemedText style={styles.tokenItemBalance}>{ellipsisText(w.address, 6, 6)}</ThemedText>
              </View>
              {w.isDefault && <ThemedText style={{ color: '#10B981', fontWeight: '600' }}>Default</ThemedText>}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    tokenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: PADDING_DEFAULT.Padding16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
      gap: 12,
    },
    tokenIcon: {
      width: 36,
      height: 36,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    tokenItemContent: {
      flex: 1,
      gap: 4,
    },
    tokenItemSymbol: {
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    tokenItemBalance: {
      color: COLORS.gray,
    },
    tokenItemSelected: {
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
  })


export default SelectAccount