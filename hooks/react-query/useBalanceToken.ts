import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { Token } from '@/services/moralis/type'
import { TQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'

import useChainSelected from '../useChainSelected'
import useWallets from '../useWallets'

const getData = async ({ queryKey }: TQueryKey): Promise<any> => {
  const [, address, chainId] = queryKey as [string, string, ChainId]
  const data = await MoralisService.getBalancesTokenByAddress({
    address,
    chainId,
    limit: 100,
  })

  return data
}

const useBalanceToken = (isFilterNonUSD = false) => {
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()

  const queries = useQuery({
    queryKey: [KEY_REACT_QUERY.getBalancesTokenByAddress, wallet?.address || '0x', chainId],
    queryFn: getData,
    enabled: !!wallet?.address && !!chainId,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const dataQuery = useMemo(() => {
    let arrSort: Token[] = []
    if (!isFilterNonUSD) {
      arrSort = queries?.data || []
    } else {
      arrSort = queries?.data?.filter((token: Token) => token?.usd_value > 0.001) || []
    }
    return arrSort.sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))
  }, [queries?.data, isFilterNonUSD])

  return { ...queries, data: dataQuery }
}

export default useBalanceToken
