import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { KEY_STORAGE } from '@/constants/storage'
import MoralisService from '@/services/moralis'
import { Token } from '@/services/moralis/type'
import { IQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'
import { sleep } from '@/utils/functions'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import useChainSelected from '../useChainSelected'
import useFilter from '../useFilter'
import useWallets from '../useWallets'

import TokenService from '@/services/token'
import useBalanceTokenImport from './useBalanceTokenImport'

const getData = async ({ queryKey }: IQueryKey): Promise<any> => {
  let dataLocal = getDataLocal(KEY_STORAGE.BalanceTokenLocal)
  const [, address, chainId] = queryKey as [string, string, ChainId]

  if (dataLocal && dataLocal[`${chainId}_${address}`]) {
    return dataLocal[`${chainId}_${address}`]
  }

  const [dataMoralis, dataImportLocal] = await Promise.all([
    MoralisService.getBalancesTokenByAddress({
      address,
      chainId,
      limit: 100,
    }),
    TokenService.getListTokenImportLocal(chainId, address),
  ])


  saveDataLocal(KEY_STORAGE.BalanceTokenLocal, {
    ...dataLocal,
    [`${chainId}_${address}`]: [
      ...dataMoralis, ...dataImportLocal
    ],
  })

  return [
    ...dataMoralis, ...dataImportLocal
  ]
}

const useBalanceToken = (noFilter = false) => {
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()
  const { filters } = useFilter()

  const { data: listTokenImport, refetch: refetchTokenImport } = useBalanceTokenImport()

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
    let arrSort: Token[] = [...(listTokenImport || []), ...(queries?.data || [])]
    arrSort = arrSort.sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))
    arrSort = arrSort.sort((a, b) => (b.is_imported === a.is_imported ? 0 : b.is_imported ? 1 : -1)) // imported to top

    if (noFilter) {
      return arrSort
    }

    if (filters?.tokens?.hideSpam) {
      arrSort = arrSort.filter((token: Token) => !token?.possible_spam)
    }

    if (filters?.tokens?.hideSmallBalances) {
      arrSort = arrSort.filter((token: Token) => (token?.usd_value || 0) >= 0.001)
    }

    if (filters?.tokens?.hideImported) {
      arrSort = arrSort.filter((token: Token) => !token?.is_imported)
    }

    return arrSort
  }, [queries?.data, filters?.tokens, noFilter, listTokenImport])

  const totalUSD = useMemo(() => {
    if (!dataQuery || dataQuery.length === 0) return 0
    return dataQuery.reduce((acc: number, token: Token) => acc + (token?.usd_value || 0), 0)
  }, [dataQuery])

  const refetch = async () => {
    let dataLocal = getDataLocal(KEY_STORAGE.BalanceTokenLocal)
    if (dataLocal && dataLocal[`${chainId}_${wallet?.address}`]) {
      delete dataLocal[`${chainId}_${wallet?.address}`]
      saveDataLocal(KEY_STORAGE.BalanceTokenLocal, dataLocal)
    }
    await sleep(100)
    await Promise.all([refetchTokenImport(), queries.refetch()])
  }

  return { ...queries, totalUSD, data: dataQuery, refetch }
}

export default useBalanceToken
