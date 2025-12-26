import { PAGE_SIZE } from "@/constants/app"
import { KEY_REACT_QUERY } from "@/constants/reactQuery"
import MoralisService from "@/services/moralis"
import { HistoryTx } from "@/services/moralis/type"
import { useInfiniteQuery } from "@tanstack/react-query"
import useChainSelected from "../useChainSelected"
import useWallets from "../useWallets"

const useHistoryTx = (option: 'nft' | 'token' = 'token') => {
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()

  const data = useInfiniteQuery({
    queryKey: [KEY_REACT_QUERY.getHistoryTxByWallet, wallet?.address, chainId, addressCollection],
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

  return data
}
export default useHistoryTx