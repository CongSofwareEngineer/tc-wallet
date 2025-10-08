import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { CHAIN_MORALIS_SUPPORT } from '@/constants/moralis'
import { ChainId } from '@/types/web3'

import { Token } from './type'

const fetcher = (params: IFetch) => {
  console.log('====================================')
  console.log({ params })
  console.log('====================================')
  const url = `/api/v2.2${params?.url}`
  return fetcherConfig({
    baseUrl: 'https://deep-index.moralis.io',
    headers: {
      accept: 'application/json',
      'X-API-Key': process.env.EXPO_PUBLIC_MORALIS_API_KEY || '',
    },
    ...params,
    url,
  })
}

class MoralisService {
  static getChainType(chainId: ChainId) {
    return CHAIN_MORALIS_SUPPORT[Number(chainId) as keyof typeof CHAIN_MORALIS_SUPPORT] || 'eth'
  }

  static async getBalancesTokenByAddress(params: { address: string; chainId: ChainId; limit?: number }): Promise<Token[]> {
    try {
      const res = await fetcher({
        url: `/wallets/${params.address}/tokens?chain=${this.getChainType(params.chainId)}&exclude_spam=true&limit=${params.limit || 100}`,
      })

      return (res.result || []) as Token[]
    } catch (error) {
      return []
    }
  }
}

export default MoralisService
