import { useQuery } from '@tanstack/react-query'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { TQueryKey } from '@/types/reactQuery'

const getData = async ({ queryKey }: TQueryKey): Promise<any> => {
  const [, params] = queryKey as [string, { address: string; chain: string; limit?: number }]
  return MoralisService.getBalancesTokenByAddress(params)
}

const useBalanceToken = (params: { address: string; chain: string; limit?: number }) => {
  const queries = useQuery({
    queryKey: [KEY_REACT_QUERY.getBalancesTokenByAddress, params],
    queryFn: getData,
    enabled: !!params.address && !!params.chain,
  })

  return queries
}

export default useBalanceToken
