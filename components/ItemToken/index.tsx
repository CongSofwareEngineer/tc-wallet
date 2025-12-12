import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'
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
}

const ItemToken = ({ item, onClick, swipeableProps }: Props) => {
  const { text } = useTheme()
  return (
    <Swipeable {...swipeableProps}>
      <TouchableOpacity
        onPress={() => {
          onClick && onClick(item)
        }}
        style={styles.cryptoItem}
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
            {BigNumber(item.balance_formatted).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()} {item.symbol}
          </ThemedText>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <ThemedText style={styles.cryptoBalance}>{BigNumber(item?.usd_value || '0').decimalPlaces(4, BigNumber.ROUND_DOWN).toFormat()}$</ThemedText>
          {
            typeof item?.usd_price_24hr_percent_change === 'number' && (
              <ThemedText style={[styles.cryptoChange, { color: item.usd_price_24hr_percent_change >= 0 ? '#00D09C' : '#FF4D4D' }]}>
                {item.usd_price_24hr_percent_change >= 0 ? '+' : ''}
                {item.usd_price_24hr_percent_change.toFixed(2)}%
              </ThemedText>
            )
          }

        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

export default ItemToken
