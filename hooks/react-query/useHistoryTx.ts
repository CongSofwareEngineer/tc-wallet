import { PAGE_SIZE } from "@/constants/app"
import { KEY_REACT_QUERY } from "@/constants/reactQuery"
import MoralisService from "@/services/moralis"
import { HistoryTx } from "@/services/moralis/type"
import { useInfiniteQuery } from "@tanstack/react-query"
import useChainSelected from "../useChainSelected"
import useWallets from "../useWallets"

const useHistoryTx = (params?: {
  filterType?: 'all' | 'token' | 'nft'
  filterDirection?: 'all' | 'in' | 'out'
}) => {
  const { filterType = 'all', filterDirection = 'all' } = params || {}
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()

  const data = useInfiniteQuery({
    queryKey: [KEY_REACT_QUERY.getHistoryTxByWallet, wallet?.address, chainId],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const response = await MoralisService.getHistoryTxByWallet({
        address: wallet?.address || '',
        chainId,
        cursor: pageParam,
        limit: PAGE_SIZE,
      })

      return response
    },
    getNextPageParam: (lastPage: HistoryTx) => lastPage.cursor || undefined,
    enabled: !!wallet?.address && !!chainId,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  let filteredResult = data.data?.pages.flatMap((page) => page.result) || []

  if (filterType !== 'all') {
    filteredResult = filteredResult.filter((item) => {
      const hasNFT = (item.nft_transfers?.length || 0) > 0
      const hasToken = (item.erc20_transfers?.length || 0) > 0 || (item.native_transfers?.length || 0) > 0

      if (filterType === 'nft') return hasNFT
      if (filterType === 'token') return hasToken
      return true
    })
  }

  if (filterDirection !== 'all') {
    filteredResult = filteredResult.filter((item) => {
      let direction: 'incoming' | 'outgoing' | null = null

      if (item.nft_transfers?.length) {
        direction = item.nft_transfers[0].direction
      } else if (item.native_transfers?.length) {
        direction = item.native_transfers[0].direction
      } else if (item.erc20_transfers?.length) {
        const token = item.erc20_transfers[0]
        direction = token.to_address.toLowerCase() === wallet?.address?.toLowerCase() ? 'incoming' : 'outgoing'
      }

      if (filterDirection === 'in') return direction === 'incoming'
      if (filterDirection === 'out') return direction === 'outgoing'
      return true
    })
  }

  return { ...data, data: filteredResult }
}
export default useHistoryTx