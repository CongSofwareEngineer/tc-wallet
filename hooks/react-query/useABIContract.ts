import { useQuery } from '@tanstack/react-query'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import EtherScanService from '@/services/etherScan'
import { IQueryKey } from '@/types/reactQuery'

import { ChainId } from '@/types/web3'
import useChainSelected from '../useChainSelected'

const getData = async ({ queryKey }: IQueryKey) => {
  const [, address, chainId] = queryKey
  const abi = await EtherScanService.getContractABI(chainId as number, address as string)
  return abi
}

const useABIContract = (chainIdRequest?: ChainId, address?: string) => {
  const { chainId } = useChainSelected()

  return useQuery({
    queryKey: [KEY_REACT_QUERY.getABIContract, address, chainIdRequest || chainId],
    queryFn: getData,
    enabled: !!address && !!chainId,
  })
}

export default useABIContract
