import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { Token } from '@/services/moralis/type'
import { TQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'
import { sleep } from '@/utils/functions'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import useChainSelected from '../useChainSelected'
import useWallets from '../useWallets'

const getData = async ({ queryKey }: TQueryKey): Promise<any> => {
  let dataLocal = getDataLocal('balanceToken')
  const [, address, chainId] = queryKey as [string, string, ChainId]

  if (dataLocal && dataLocal[`${chainId}_${address}`]) {
    return dataLocal[`${chainId}_${address}`]
  }

  const data = await MoralisService.getBalancesTokenByAddress({
    address,
    chainId,
    limit: 100,
  })

  saveDataLocal('balanceToken', {
    ...dataLocal,
    [`${chainId}_${address}`]: data,
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

  const totalUSD = useMemo(() => {
    if (!dataQuery || dataQuery.length === 0) return 0
    return dataQuery.reduce((acc: number, token: Token) => acc + (token?.usd_value || 0), 0)
  }, [dataQuery])

  const refetch = async () => {
    let dataLocal = getDataLocal('balanceToken')
    if (dataLocal && dataLocal[`${chainId}_${wallet?.address}`]) {
      delete dataLocal[`${chainId}_${wallet?.address}`]
      saveDataLocal('balanceToken', dataLocal)
    }
    await sleep(100)
    queries.refetch()
  }

  return { ...queries, totalUSD, data: dataQuery, refetch }
}

export default useBalanceToken
