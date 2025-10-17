import { useQuery } from '@tanstack/react-query'

import fetcher from '@/configs/fetcher'
import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { NFT } from '@/services/moralis/type'
import { IQueryKey } from '@/types/reactQuery'
import { detectUrlImage } from '@/utils/functions'

type UseNftMetadataEVM = {
  animation_url?: string
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Record<string, any>
}

const getData = async ({ queryKey }: IQueryKey): Promise<UseNftMetadataEVM> => {
  try {
    const nft = queryKey[1] as NFT

    if (nft?.token_uri) {
      const resTokenUrl = await fetcher({
        url: nft?.token_uri,
      })

      if (resTokenUrl?.data.image) {
        resTokenUrl.data.image = detectUrlImage(resTokenUrl.data.image)
      }

      return resTokenUrl?.data
    }

    return {}
  } catch (error) {
    return {}
  }
}
const useNftMetadataEVM = (nft: NFT) => {
  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getNftMetadataEVM, nft],
    queryFn: getData,
  })

  return data
}

export default useNftMetadataEVM
