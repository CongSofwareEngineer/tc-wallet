import { useQuery } from '@tanstack/react-query'
import { zeroAddress } from 'viem'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import TokenService from '@/services/token'
import { ChainId } from '@/types/web3'

import useChains from '../useChains'

const getData = async ({ queryKey }: { queryKey: any[] }) => {
  const chainId = queryKey[1] as ChainId

  const balance = await TokenService.getBalanceToken(zeroAddress, chainId)
  return balance // Mock balance
}
const useBalanceNative = (enable = true) => {
  const { chainCurrent } = useChains()
  return useQuery({
    queryKey: [KEY_REACT_QUERY.getBalanceNative, chainCurrent?.id],
    queryFn: getData,
    enabled: enable && !!chainCurrent,
  })
}

export default useBalanceNative
