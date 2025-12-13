import { COLORS } from '@/constants/style'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'
import { ellipsisText } from '@/utils/functions'
import { MaterialIcons } from '@expo/vector-icons'
import BigNumber from 'bignumber.js'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Swipeable, SwipeableProps } from 'react-native-gesture-handler'
import MyImage from '../MyImage'
import ThemedText from '../UI/ThemedText'
import { styles } from './styles'
type Props = {
  item: Token
  onClick?: (token: Token) => any
  swipeableProps?: SwipeableProps
  showAddress?: boolean
  isSelected?: boolean
}

const ItemToken = ({ item, onClick, swipeableProps, showAddress, isSelected }: Props) => {
  const { text } = useTheme()
  return (
    <Swipeable {...swipeableProps}>
      <TouchableOpacity
        onPress={() => {
          onClick && onClick(item)
        }}
        style={[styles.cryptoItem]}
      >
        <View style={[styles.cryptoIcon]}>
          {item.logo || item.thumbnail ? (
            <MyImage src={item.logo || item.thumbnail} style={{ width: 36, height: 36, borderRadius: 18 }} />
          ) : (
            <MaterialIcons name='token' size={40} color={text.color} />
          )}
        </View>

        <View style={styles.cryptoInfo}>
          <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.cryptoBalance}>
            {item.balance_formatted && `${BigNumber(item.balance_formatted).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()} `}
            {item.symbol}
          </ThemedText>
          {showAddress && (
            <ThemedText style={styles.cryptoBalance} type='small'>
              {ellipsisText(item.token_address, 6, 8)}
            </ThemedText>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          {item?.usd_value > 0 && (
            <ThemedText style={styles.cryptoBalance}>
              {BigNumber(item?.usd_value || '0')
                .decimalPlaces(4, BigNumber.ROUND_DOWN)
                .toFormat()}
              $
            </ThemedText>
          )}
          {item?.usd_price_24hr_percent_change !== 0 && (
            <ThemedText style={[styles.cryptoChange, { color: item.usd_price_24hr_percent_change >= 0 ? '#00D09C' : '#FF4D4D' }]}>
              {item.usd_price_24hr_percent_change >= 0 ? '+' : ''}
              {item.usd_price_24hr_percent_change.toFixed(2)}%
            </ThemedText>
          )}
        </View>
        {isSelected && (
          <View style={{ position: 'absolute', right: 10, top: 10 }}>
            <MaterialIcons name='check' size={20} color={COLORS.green} />
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  )
}

export default ItemToken
