import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import DeBridgeServices from '@/services/deBridge'
import { Token } from '@/services/moralis/type'
import { ChainId } from '@/types/web3'
import { useQuery } from '@tanstack/react-query'

const getListTokenByChain = async ({ queryKey }: any): Promise<Token[]> => {
  const chainId = queryKey[1]
  const textSearch = queryKey[2]
  let res = await DeBridgeServices.getListTokenByChain(chainId, textSearch)

  return res
}

const useListTokenByChainDeBridge = (chainId?: ChainId, textSearch: string | string[] = '', noRefetch = false) => {
  const { data, isLoading, isFetching } = useQuery<Token[]>({
    queryKey: [KEY_REACT_QUERY.getListTokenByChain, chainId, textSearch],
    queryFn: getListTokenByChain,
    refetchOnWindowFocus: !noRefetch,
    enabled: !!chainId,
  })

  return {
    isLoading,
    isFetching,
    data: data || [],
  }
}

export default useListTokenByChainDeBridge
