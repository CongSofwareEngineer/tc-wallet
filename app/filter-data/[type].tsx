import { Checkbox } from 'expo-checkbox'
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { useFilter } from '@/hooks/useFilter'
import useTheme from '@/hooks/useTheme'
import { FilterState } from '@/store/slices/filterSlice'
import { cloneDeep } from '@/utils/functions'

const FilterDataScreen = () => {
  const { type = 'tokens' } = useLocalSearchParams<{ type?: string }>()
  const { filters, setFilterToken } = useFilter()
  const { background } = useTheme()

  const dataFilter = useMemo(() => {
    if (type === 'tokens') {
      return filters.tokens
    }
    return filters.tokens
  }, [type, filters])

  const handleUpdateToken = (params: Partial<FilterState['tokens']>) => {
    let dataClone = cloneDeep(dataFilter) as Partial<FilterState['tokens']>
    if (typeof params?.all === 'boolean') {
      dataClone = { all: params?.all }
    } else {
      dataClone = { ...dataClone, ...params, all: false }
    }

    setFilterToken(dataClone)
  }

  const handleUpdateNft = (params: Partial<FilterState['nfts']>) => {
    let dataClone = cloneDeep(dataFilter) as Partial<FilterState['nfts']>
    if (typeof params?.all === 'boolean') {
      dataClone = { all: params?.all }
    } else {
      dataClone = { ...dataClone, ...params, all: false }
    }

    setFilterToken(dataClone)
  }

    const renderFilterItem = (label: string, value: boolean, onToggle: () => void) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(150,150,150,0.2)',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText style={{ fontSize: 16, flex: 1 }}>{label}</ThemedText>
        <Checkbox
          value={value}
          onValueChange={onToggle}
          color={value ? '#2196F3' : undefined}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 2,
          }}
        />
      </View>
    </TouchableOpacity>
  )

  const renderFilterTokens = () => {
    return (
      <View style={{ width: '100%' }}>
        {renderFilterItem('Show All Tokens', dataFilter.all, () => handleUpdateToken({ all: !dataFilter.all }))}
        {renderFilterItem('Hide Spam Tokens', dataFilter.hideSpam, () => handleUpdateToken({ hideSpam: !dataFilter.hideSpam }))}
        {renderFilterItem('Hide Small Balance Tokens', dataFilter.hideSmallBalances, () =>
          handleUpdateToken({ hideSmallBalances: !dataFilter.hideSmallBalances })
        )}
        {renderFilterItem('Hide Imported Tokens', dataFilter.hideImported, () => handleUpdateToken({ hideImported: !dataFilter.hideImported }))}
      </View>
    )
  }

  const renderFilterNfts = () => {
    return (
      <View style={{ width: '100%' }}>
        {renderFilterItem('Show All NFTs', dataFilter.all, () => handleUpdateNft({ all: !dataFilter.all }))}
        {renderFilterItem('Hide Spam NFTs', dataFilter.hideSpam, () => handleUpdateNft({ hideSpam: !dataFilter.hideSpam }))}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={{
          width: '100%',
          backgroundColor: background.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              height: 4,
              backgroundColor: '#e0e0e0',
              borderRadius: 2,
              width: 40,
              marginBottom: 16,
            }}
          />
          <ThemedText style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Filter {type.charAt(0).toUpperCase() + type.slice(1)}</ThemedText>
        </View>
        {type === 'tokens' ? renderFilterTokens() : renderFilterNfts()}
      </View>
    </View>
  )
}

export default FilterDataScreen
