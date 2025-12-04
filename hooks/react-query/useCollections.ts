import { PAGE_SIZE } from '@/constants/app'
import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import useChainSelected from '../useChainSelected'
import useFilter from '../useFilter'
import useWallets from '../useWallets'

const useCollections = () => {
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()
  const { filters } = useFilter()

  const data = useInfiniteQuery({
    queryKey: [KEY_REACT_QUERY.getCollectionsByWallet, wallet?.address, chainId],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const response = await MoralisService.getCollectionsByWallet({
        // address: '0x9f276af79b2b5de2946a88b0fe2717318f924d7c',
        address: wallet?.address || '',

        chainId,
        cursor: pageParam,
        limit: PAGE_SIZE,
      })

      return response
    },
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    enabled: !!wallet?.address && !!chainId,
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
  console.log({ useCollections: dataQuery })

  return { ...data, data: dataQuery }
}

export default useCollections
