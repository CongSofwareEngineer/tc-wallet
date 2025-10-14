import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { NFTResponse } from '@/services/moralis/type'
import { sleep } from '@/utils/functions'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import useChainSelected from '../useChainSelected'
import useFilter from '../useFilter'
import useWallets from '../useWallets'

const PAGE_SIZE = 20

const useListNFTs = () => {
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()
  const { filters } = useFilter()

  const data = useInfiniteQuery({
    queryKey: [KEY_REACT_QUERY.getNFTsByWallet, wallet?.address, chainId],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      console.log({ pageParam })

      let dataLocal = getDataLocal('listNFts')
      if (dataLocal && dataLocal[`${chainId}_${wallet?.address}_${pageParam}`]) {
        return dataLocal[`${chainId}_${wallet?.address}_${pageParam}`]
      }
      const response = await MoralisService.getNFTsByWallet({
        address: wallet?.address || '',
        chainId,
        cursor: pageParam,
        limit: PAGE_SIZE,
      })
      saveDataLocal('listNFts', {
        ...dataLocal,
        [`${chainId}_${wallet?.address}_${pageParam}`]: response,
      })

      return response as NFTResponse
    },
    getNextPageParam: (lastPage: NFTResponse) => lastPage.cursor || undefined,
    enabled: !!wallet?.address && !!chainId,
  })

  const dataQuery = useMemo(() => {
    if (!data.data) return []
    let allNFTs = data.data.pages.flatMap((page) => page.result)
    // Apply filters
    if (filters?.nfts?.hideSpam) {
      allNFTs = allNFTs.filter((nft) => {
        // Apply your filtering logic here
        return !nft?.possible_spam
      })
    }
    return allNFTs
  }, [data.data, filters])
  console.log({ dataQuery })

  const refetch = async () => {
    let dataLocal = getDataLocal('listNFts')
    if (dataLocal && dataLocal[`${chainId}_${wallet?.address}`]) {
      delete dataLocal[`${chainId}_${wallet?.address}`]
      saveDataLocal('listNFts', dataLocal)
    }
    await sleep(100)
    data.refetch()
  }

  return { ...data, data: dataQuery }
}

export default useListNFTs
