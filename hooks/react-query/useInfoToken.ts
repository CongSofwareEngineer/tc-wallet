import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import TokenService from '@/services/token'
import { IQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'
import { useQuery } from '@tanstack/react-query'
import { Address, isAddress } from 'viem'
type InfoToken = {
  symbol?: string
  decimals?: number
  name?: string
  noToken?: boolean
}
const getData = async ({ queryKey }: IQueryKey): Promise<InfoToken> => {
  try {
    const [, address, chainId] = queryKey as [string, Address, ChainId]

    const infoToken = await TokenService.getInfoToken(address, chainId)

    return infoToken
  } catch {
    return { noToken: true }
  }
}

const useInfoToken = (address?: string, chainId?: ChainId) => {
  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getInfoToken, address, chainId],
    queryFn: getData,
    enabled: isAddress(address || '0x') && !!chainId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })

  return data
}

export default useInfoToken
