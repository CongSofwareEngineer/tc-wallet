import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import { ChainId, Network } from '@/types/web3'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import MyImage from '../MyImage'
import ThemedText from '../UI/ThemedText'
import { styles } from './styles'

type Props = {
  item: Network
  onPress?: (chainId?: ChainId) => any
  noEdit?: boolean
}
const ItemChain = ({ item, onPress, noEdit = false }: Props) => {
  const router = useRouter()
  const { text } = useTheme()
  const { chainCurrent } = useChains()

  return (
    <TouchableOpacity
      style={[styles.networkItem, chainCurrent?.id === item.id && styles.selectedNetworkItem]}
      onPress={() => onPress?.(item.id)}
    >
      <View style={styles.networkIconWrap}>
        {item?.iconChain ? (
          <MyImage src={item.iconChain} style={styles.networkIcon} />
        ) : (
          <ThemedText style={styles.networkIconText}>{item.name[0]}</ThemedText>
        )}
      </View>
      <View style={styles.networkInfo}>
        <ThemedText numberOfLines={1} style={styles.networkName}>
          {item.name}
        </ThemedText>
      </View>
      {
        !noEdit && (
          <TouchableOpacity onPress={() => router.push(`/chain-detail/${item.id}`)} style={styles.menuButton}>
            <AntDesign name='edit' size={20} color={text.color} />
          </TouchableOpacity>
        )
      }
    </TouchableOpacity>
  )
}

export default ItemChain
