import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { toggleNFTSpamFilter, toggleTokenBalanceFilter, toggleTokenImportedFilter, toggleTokenSpamFilter } from '@/redux/slices/filterSlice'
import { RootState } from '@/store'

import { styles } from './styles'

interface FilterOptionProps {
  label: string
  value: boolean
  onToggle: () => void
}

const FilterOption = ({ label, value, onToggle }: FilterOptionProps) => (
  <ThemeTouchableOpacity style={styles.filterOption} onPress={onToggle}>
    <View style={[styles.checkbox, value && styles.checkboxActive]} />
    <ThemedText style={styles.filterLabel}>{label}</ThemedText>
  </ThemeTouchableOpacity>
)

interface TokenFilterProps {
  type: 'tokens' | 'nfts'
}

const FilterSection = ({ type }: TokenFilterProps) => {
  const dispatch = useDispatch()
  const filters = useSelector((state: RootState) => state.filter[type])

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{type === 'tokens' ? 'Token Filters' : 'NFT Filters'}</ThemedText>

      {type === 'tokens' ? (
        <>
          <FilterOption label='Hide spam tokens' value={filters.hideSpam} onToggle={() => dispatch(toggleTokenSpamFilter())} />
          <FilterOption
            label='Hide small balances (<$0.001)'
            value={filters.hideSmallBalances}
            onToggle={() => dispatch(toggleTokenBalanceFilter())}
          />
          <FilterOption label='Hide imported tokens' value={filters.hideImported} onToggle={() => dispatch(toggleTokenImportedFilter())} />
        </>
      ) : (
        <FilterOption label='Hide spam NFTs' value={filters.hideSpam} onToggle={() => dispatch(toggleNFTSpamFilter())} />
      )}
    </View>
  )
}

export default FilterSection
