import ItemToken from '@/components/ItemToken'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import { LIST_TOKEN_DEFAULT } from '@/constants/debridge'
import { GAP_DEFAULT } from '@/constants/style'
import useDebounce from '@/hooks/useDebounce'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'
import { ChainId } from '@/types/web3'
import { lowercase } from '@/utils/functions'
import { height } from '@/utils/systems'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import MyImage from '../MyImage'
import MyLoading from '../MyLoading'
type Props = {
  onPress: (token: Token) => void
  data: Token[]
  showAddress?: boolean
  onEndReached?: () => void
  onEndReachedThreshold?: number
  hasMore?: boolean
  loading?: boolean
  showTokenDefault?: boolean
  chainId?: ChainId
  tokenSelected?: Token
}
const SelectToken = ({
  chainId,
  tokenSelected,
  showTokenDefault,
  onPress,
  data,
  showAddress,
  onEndReached,
  onEndReachedThreshold,
  hasMore,
  loading,
}: Props) => {
  const [search, setSearch] = useState('')
  const debounceValue = useDebounce(search, 500)
  const { text } = useTheme()

  const dataFiltered = useMemo(() => {
    if (!debounceValue) return data
    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(debounceValue.toLowerCase()) ||
        item.symbol.toLowerCase().includes(debounceValue.toLowerCase()) ||
        item.token_address.toLowerCase().includes(debounceValue.toLowerCase())
      )
    })
  }, [data, debounceValue])

  const defaultToken = useMemo(() => {
    if (chainId) {
      const arr = LIST_TOKEN_DEFAULT[chainId]
      const arrFilter = dataFiltered.filter((item) => arr.includes(item.symbol))
      return arrFilter
    }
    return []
  }, [chainId, dataFiltered])

  const renderTokenDefault = () => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap', gap: GAP_DEFAULT.Gap8, marginTop: 10 }}>
        {defaultToken.map((item) => {
          const isSelected = lowercase(item?.token_address) === lowercase(tokenSelected?.token_address)
          return (
            <TouchableOpacity onPress={() => onPress(item)} key={`token-default-${item.token_address}`}>
              <View
                style={{
                  borderColor: text.color,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 8,
                  gap: GAP_DEFAULT.Gap8,
                  opacity: isSelected ? 0.5 : 1,
                }}
              >
                {item.logo || item.thumbnail ? (
                  <MyImage src={item.logo || item.thumbnail} style={{ width: 24, height: 24, borderRadius: 12 }} />
                ) : (
                  <MaterialIcons name='token' size={24} color={text.color} />
                )}
                <ThemedText>{item.symbol}</ThemedText>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View>
      <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
        Select Token
      </ThemedText>
      <ThemedInput
        rightIcon={<Feather name='search' size={24} color='#9CA3AF' />}
        placeholder='Search name or paste address'
        value={search}
        showCount={false}
        onChangeText={setSearch}
      />

      <View style={{ height: height(70), marginTop: 10 }}>
        {showTokenDefault && renderTokenDefault()}
        <FlatList
          // contentContainerStyle={{ paddingBottom: 50 }}
          data={dataFiltered}
          keyExtractor={(item, index) => `token-${item.token_address}-${index}`}
          renderItem={({ item }) => {
            const isSelected = lowercase(item?.token_address) === lowercase(tokenSelected?.token_address)
            return (
              <ItemToken
                isSelected={isSelected}
                item={item}
                onClick={() => {
                  onPress(item)
                }}
                showAddress={showAddress}
              />
            )
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          ListHeaderComponent={
            loading ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <MyLoading />
              </View>
            ) : (
              <></>
            )
          }
          ListFooterComponent={
            hasMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ThemedText style={{ color: '#9CA3AF' }}>Loading...</ThemedText>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  )
}

export default SelectToken
