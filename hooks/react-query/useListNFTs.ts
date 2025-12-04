import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { NFTResponse } from '@/services/moralis/type'

import useChainSelected from '../useChainSelected'
import useFilter from '../useFilter'
import useWallets from '../useWallets'

const PAGE_SIZE = 20

const useListNFTs = (addressCollection: string[] = []) => {
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()
  const { filters } = useFilter()

  const data = useInfiniteQuery({
    queryKey: [KEY_REACT_QUERY.getNFTsByWallet, wallet?.address, chainId, addressCollection],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const response = await MoralisService.getNFTsByWallet({
        address: wallet?.address || '',
        // address: '0x9f276af79b2b5de2946a88b0fe2717318f924d7c',
        chainId,
        cursor: pageParam,
        limit: PAGE_SIZE,
        addressCollection,
      })

      return response as NFTResponse
    },
    getNextPageParam: (lastPage: NFTResponse) => lastPage.cursor || undefined,
    enabled: !!wallet?.address && !!chainId && addressCollection?.length! > 0,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
  console.log({ dataQuery, filters })

  return { ...data, data: dataQuery }
}

export default useListNFTs
