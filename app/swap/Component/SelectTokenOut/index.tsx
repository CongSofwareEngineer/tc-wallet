import SelectToken from '@/components/SelectToken'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useListTokenByChainDeBridge from '@/hooks/react-query/useListTokenByChainDeBridge'
import { Token } from '@/services/moralis/type'
import { ChainId } from '@/types/web3'
import { lowercase } from '@/utils/functions'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
type Props = {
  chainId?: ChainId
  onPress: (token: Token) => void
  token?: Token
}
const DECIMAL = 4
const PAGE_SIZE = 20
const SelectTokenOut = ({ token, chainId, onPress }: Props) => {
  const { data: listTokenAPI, isLoading: isLoadingListTokenAPI } = useListTokenByChainDeBridge(chainId)
  const { data: balanceToken, isLoading: isLoadingBalanceToken } = useBalanceToken()
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const isLoading = isLoadingListTokenAPI || isLoadingBalanceToken
  const listTokenSwap = useMemo(() => {
    if (!listTokenAPI || !balanceToken) {
      return []
    }
    let mergedArr = [...listTokenAPI, ...balanceToken]
      .reduce<Map<string, Token>>((acc, obj) => {
        acc.set(obj.token_address, obj)
        return acc
      }, new Map())
      .values()

    const arrSort = Array.from(mergedArr).sort((a, b) => {
      const usdTokenA = BigNumber(a?.usd_value || '0')
        .decimalPlaces(DECIMAL)
        .toNumber()

      const balanceA = BigNumber(a?.balance || '0')
        .decimalPlaces(DECIMAL)
        .toNumber()

      const usdTokenB = BigNumber(b?.usd_value || '0')
        .decimalPlaces(DECIMAL)
        .toNumber()

      const balanceB = BigNumber(b?.balance || '0')
        .decimalPlaces(DECIMAL)
        .toNumber()

      if (usdTokenA > 0 || usdTokenB > 0) {
        return usdTokenB - usdTokenA
      }
      if (lowercase(token?.token_address) === lowercase(a?.token_address)) {
        return -1
      }

      return balanceB - balanceA
    })
    return arrSort
  }, [listTokenAPI, balanceToken])

  const paginatedData = useMemo(() => {
    if (isLoading) {
      return []
    }
    return listTokenSwap.slice(0, displayCount)
  }, [listTokenSwap, displayCount, isLoading])

  // Reset display count when chainId changes
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [chainId])

  const handleLoadMore = useCallback(() => {
    if (displayCount < listTokenSwap.length) {
      setDisplayCount((prev) => prev + PAGE_SIZE)
    }
  }, [displayCount, listTokenSwap.length])

  const hasMore = displayCount < listTokenSwap.length

  return (
    <SelectToken
      tokenSelected={token}
      showTokenDefault
      chainId={chainId}
      loading={isLoading}
      showAddress
      data={paginatedData}
      onPress={(token) => {
        onPress(token)
      }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      hasMore={hasMore}
    />
  )
}

export default SelectTokenOut
