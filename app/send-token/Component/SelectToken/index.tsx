import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import MyImage from '@/components/MyImage'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS, PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'
import { lowercase } from '@/utils/functions'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const SelectToken = ({ addressToken }: { addressToken?: string }) => {
  const { isDark } = useMode()
  const router = useRouter()
  const { closeSheet } = useSheet()
  const { text } = useTheme()
  const { data: listTokens } = useBalanceToken()

  const styles = createStyles(isDark)
  const selectedToken = useMemo(() => {
    return listTokens?.find((token) => lowercase(token.token_address) === lowercase(addressToken))
  }, [addressToken, listTokens])

  const handleSelectToken = (token: Token) => {
    router.setParams({ address: token.token_address })
    closeSheet()
  }

  return (
    <View style={styles.container}>
      <ThemedText type='subtitle' style={styles.title}>
        Chọn Token
      </ThemedText>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {listTokens?.map((token, index) => {
          const isSelected = selectedToken?.token_address === token.token_address

          return (
            <TouchableOpacity
              key={token.token_address + index}
              style={[styles.tokenItem, isSelected && styles.tokenItemSelected]}
              onPress={() => handleSelectToken(token)}
              activeOpacity={0.7}
            >
              {/* Token Icon */}
              <MyImage src={token.logo || token.thumbnail} style={styles.tokenIcon} />

              {/* Token Info */}
              <View style={styles.tokenInfo}>
                <View style={styles.tokenHeader}>
                  <ThemedText style={styles.tokenSymbol}>{token.symbol}</ThemedText>
                  {isSelected && (
                    <View style={styles.verifiedBadge}>
                      <AntDesign name='check' size={12} color={text.color} />
                    </View>
                  )}
                </View>
                <ThemedText style={styles.tokenName} numberOfLines={1}>
                  {token.name}
                </ThemedText>
              </View>

              {/* Balance Info */}
              <View style={styles.balanceContainer}>
                <ThemedText style={styles.balanceAmount}>
                  {BigNumber(token.balance_formatted || 0)
                    .decimalPlaces(8, BigNumber.ROUND_DOWN)
                    .toFormat()}
                </ThemedText>
                {token.usd_value > 0 && (
                  <ThemedText style={styles.balanceUsd}>${BigNumber(token.usd_value).decimalPlaces(2, BigNumber.ROUND_DOWN).toFormat()}</ThemedText>
                )}
              </View>

              {/* Selected Indicator */}
              {/* {isSelected && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.selectedDot} />
                </View>
              )} */}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      marginBottom: 16,
    },
    scrollView: {},
    tokenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: PADDING_DEFAULT.Padding16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
      gap: 12,
      backgroundColor: 'transparent',
    },
    tokenItemSelected: {
      opacity: 0.5,
    },
    tokenIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    tokenInfo: {
      flex: 1,
      gap: 4,
    },
    tokenHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    tokenSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    tokenName: {
      fontSize: 13,
      color: COLORS.gray,
    },
    verifiedBadge: {
      backgroundColor: COLORS.green600,
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    verifiedText: {
      color: COLORS.white,
      fontSize: 10,
      fontWeight: '700',
    },
    balanceContainer: {
      alignItems: 'flex-end',
      gap: 2,
    },
    balanceAmount: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    balanceUsd: {
      fontSize: 13,
      color: COLORS.gray,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: COLORS.blue2,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    selectedDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.blue2,
    },
  })

export default SelectToken
