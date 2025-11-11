import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { ChainId } from '@/types/web3'
import { useQuery } from '@tanstack/react-query'
import InputDataDecoder from 'ethereum-input-data-decoder'
import useABIContract from './useABIContract'

const useDecodeTx = (chainIdRequest?: ChainId, address?: string, dataTx?: string) => {
  const { data: abiContract, isLoading: loadingGetABI } = useABIContract(chainIdRequest, address)

  const { data, isLoading } = useQuery({
    queryKey: [KEY_REACT_QUERY.getDecodeTx, address],
    queryFn: () => {
      try {
        const decoder = new InputDataDecoder(abiContract)
        const result = decoder.decodeData(dataTx || '0x')
        return result
      } catch {
        return null
      }
    },
    enabled: !!address && !!dataTx && !loadingGetABI && dataTx !== '0x',
  })
  return { data, isLoading: isLoading || loadingGetABI }
}

export default useDecodeTx
