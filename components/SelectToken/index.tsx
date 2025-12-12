import ItemToken from '@/components/ItemToken'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import { Token } from '@/services/moralis/type'
import { height } from '@/utils/systems'
import React from 'react'
import { FlatList, View } from 'react-native'
type Props = {
  onPress: (token: Token) => void
  data: Token[]
}
const SelectToken = ({ onPress, data }: Props) => {
  const [search, setSearch] = React.useState('')

  const dataFiltered = React.useMemo(() => {
    if (!search) return data
    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.token_address.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [data, search])

  return (
    <View>
      <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
        Select Output Token
      </ThemedText>
      <View style={{ height: 35, marginBottom: 10 }}>
        <ThemedInput placeholder='Search name or paste address' value={search} showCount={false} onChangeText={setSearch} />
      </View>

      <View style={{ height: height(60) }}>
        <FlatList
          // contentContainerStyle={{ paddingBottom: 50 }}
          data={dataFiltered}
          renderItem={({ item }) => (
            <ItemToken
              item={item}
              onClick={() => {
                onPress(item)
              }}
            />
          )}
        />
      </View>
    </View>
  )
}

export default SelectToken
