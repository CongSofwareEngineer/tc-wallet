import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import AlchemyService from '@/services/alchemy'
import MoralisService from '@/services/moralis'
import { IQueryKey } from '@/types/reactQuery'
import { isAddress } from '@/utils/nvm'

import useChainSelected from '../useChainSelected'

const getData = async ({ queryKey }: IQueryKey): Promise<string> => {
  try {
    const symbolOrAddress = queryKey[1] as string
    const chainId = queryKey[2] as number
    if (isAddress(symbolOrAddress)) {
      const res = await MoralisService.getPriceByAddress(symbolOrAddress, chainId)
      return res
    } else {
      const resAl = await AlchemyService.getPriceBySymbol(symbolOrAddress)

      return BigNumber(resAl || 0).toFixed()
    }
  } catch (error) {
    return '0'
  }
}

const useTokenPrice = (symbolOrAddress = '') => {
  const { chainId } = useChainSelected()

  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getTokenPrice, symbolOrAddress, chainId],
    queryFn: getData,
    enabled: !!symbolOrAddress,
  })
  return data
}
export default useTokenPrice
