import { useQuery } from '@tanstack/react-query'

import fetcher from '@/configs/fetcher'
import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { NFT } from '@/services/moralis/type'
import { IQueryKey } from '@/types/reactQuery'
import { detectUrlImage, stringifyBigInt } from '@/utils/functions'

type UseNftMetadataEVM = {
  animation_url?: string
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Record<string, any>
}

const getData = async ({ queryKey }: IQueryKey): Promise<UseNftMetadataEVM> => {
  const nft = queryKey[1] as NFT

  try {
    if (nft?.token_uri) {
      const resTokenUrl = await fetcher({
        url: nft?.token_uri,
      })

      if (resTokenUrl?.data?.image) {
        resTokenUrl.data.image = detectUrlImage(resTokenUrl.data.image)
      }

      return resTokenUrl?.data || (nft?.normalized_metadata as UseNftMetadataEVM) || {}
    }

    return (nft?.normalized_metadata as UseNftMetadataEVM) || {}
  } catch (error) {
    return (nft?.normalized_metadata as UseNftMetadataEVM) || {}
  }
}
const useNftMetadataEVM = (nft: NFT | undefined) => {
  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getNftMetadataEVM, stringifyBigInt(nft || {})],
    queryFn: getData,
    enabled: !!nft,
  })

  return data
}

export default useNftMetadataEVM
