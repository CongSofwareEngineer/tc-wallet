import { useQuery } from '@tanstack/react-query'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import MoralisService from '@/services/moralis'
import { NFT } from '@/services/moralis/type'
import { IQueryKey } from '@/types/reactQuery'

import useChainSelected from '../useChainSelected'
import useWallets from '../useWallets'

const getData = async ({ queryKey }: IQueryKey): Promise<NFT> => {
  const [, addressNFT, nftId, chainId] = queryKey as [string, string, string, string, string]
  const res = await MoralisService.getNFTsByContractTokenId(chainId, addressNFT, nftId)
  return res
}

const useIsOwnerNFT = (addressNFT: string | null, nftId: string | null) => {
  const { wallet } = useWallets()
  const { chainId } = useChainSelected()

  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getNFtDetail, addressNFT, nftId, chainId],
    queryFn: getData,
    enabled: !!wallet?.address && !!chainId && !!addressNFT && !!nftId,
  })

  return data
}

export default useIsOwnerNFT
