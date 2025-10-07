import { useQuery } from '@tanstack/react-query'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { TQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'

import useChainSelected from '../useChainSelected'

const getData = async ({ queryKey }: TQueryKey): Promise<any> => {
  const [, params, chainId] = queryKey as [string, { address: string; limit?: number }, ChainId]
  return MoralisService.getBalancesTokenByAddress({
    ...params,
    chain: chainId?.toString() || '0x1',
  })
}

const useBalanceToken = (params: { address: string; limit?: number }) => {
  const { chainId } = useChainSelected()
  const queries = useQuery({
    queryKey: [KEY_REACT_QUERY.getBalancesTokenByAddress, params, chainId],
    queryFn: getData,
    enabled: !!params.address && !!chainId,
  })

  return queries
}

export default useBalanceToken
