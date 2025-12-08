import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import EVMServices from '@/services/EVM'
import { IQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'
import { useQuery } from '@tanstack/react-query'
import { Address, isAddress } from 'viem'

const getData = async ({ queryKey }: IQueryKey): Promise<boolean> => {
  const [, address, chainId] = queryKey as [string, Address, ChainId]
  if (!isAddress(address) || !chainId) {
    return false
  }

  const isContract = await EVMServices.checkIsContract(chainId, address)

  return isContract
}

const useIsContractEVM = (address?: string, chainId?: ChainId) => {
  const { data, isLoading } = useQuery({
    queryKey: [KEY_REACT_QUERY.getIsContract, address, chainId],
    queryFn: getData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  })

  return { data, isLoading }
}

export default useIsContractEVM
