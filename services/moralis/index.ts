import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'

const fetcher = (params: IFetch) => {
  return fetcherConfig({
    baseUrl: 'https://deep-index.moralis.io/api/v2.2',
    headers: {
      'X-API-Key': process.env.EXPO_PUBLIC_MORALIS_API_KEY || '',
    },
    ...params,
  })
}

class MoralisService {
  private static baseUrl = 'https://deep-index.moralis.io/api/v2.2'

  static async getBalancesTokenByAddress(params: { address: string; chain: string; limit?: number }) {
    const res = await fetcher({
      url: `/wallets/${params.address}/tokens?chain=${params.chain}&limit=${params.limit || 100}`,
    })
    return res.data
  }
}

export default MoralisService
