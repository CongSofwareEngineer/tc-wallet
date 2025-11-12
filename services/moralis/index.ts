import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { CHAIN_MORALIS_SUPPORT } from '@/constants/moralis'
import { ChainId } from '@/types/web3'
import MoralisUtils from '@/utils/moralis'

import { Collection, NFT, NFTResponse, Token } from './type'

const fetcher = (params: IFetch) => {
  const url = `/api/v2.2${params?.url}`
  return fetcherConfig({
    baseUrl: 'https://deep-index.moralis.io',
    headers: {
      accept: 'application/json',
      'X-API-Key': MoralisUtils.getApiKey(),
    },
    ...params,
    url,
  })
}

class MoralisService {
  static async getNFTsByWallet(params: { address: string; chainId: ChainId; cursor?: string; limit?: number }): Promise<NFTResponse> {
    try {
      const res = await fetcher({
        url: `/${params.address}/nft?chain=${this.getChainType(params.chainId)}&format=decimal${params.cursor ? `&cursor=${params.cursor}` : ''}&limit=${params.limit || 20}`,
      })

      return res?.data || res
    } catch (error) {
      return {
        result: [],
        cursor: null,
        status: 'FAILED',
      }
    }
  }
  static getChainType(chainId: ChainId) {
    if (CHAIN_MORALIS_SUPPORT[Number(chainId) as keyof typeof CHAIN_MORALIS_SUPPORT] || 'eth') {
      return CHAIN_MORALIS_SUPPORT[Number(chainId) as keyof typeof CHAIN_MORALIS_SUPPORT]
    }
    throw new Error('Chain not supported')
  }

  static async getBalancesTokenByAddress(params: { address: string; chainId: ChainId; limit?: number }): Promise<Token[]> {
    try {
      const res = await fetcher({
        // url: `/wallets/${params.address}/tokens?chain=${this.getChainType(params.chainId)}&exclude_spam=true&limit=${params.limit || 100}`,
        url: `/wallets/${params.address}/tokens?chain=${this.getChainType(params.chainId)}&limit=${params.limit || 100}`,
      })

      return (res?.data?.result || res.result || []) as Token[]
    } catch (error) {
      return []
    }
  }

  static async getPriceByAddress(address: string, chainId: ChainId): Promise<string> {
    try {
      const res = await fetcher({
        url: `/erc20/${address}/price?chain=${this.getChainType(chainId)}`,
      })

      return res?.data?.usdPrice || '0'
    } catch (error) {
      return '0'
    }
  }

  static async getNFTsByContractTokenId(chainId: ChainId, contract: string, tokenId: string | null): Promise<NFT> {
    const params = new URLSearchParams({
      chain: this.getChainType(chainId),
      format: 'decimal',
      normalizeMetadata: 'true',
      media_items: 'true',
    })

    const apiPath = `/nft/${contract}/${tokenId}?${params.toString()}`
    const res = await fetcher({
      url: apiPath,
    })
    console.log({ getNFTsByContractTokenId: res })

    return res?.data as NFT
  }

  static async getCollectionsByWallet(params: { address: string; chainId: ChainId; cursor?: string; limit?: number }): Promise<{
    page: number
    cursor: null | string
    page_size: number
    result: Collection[]
    status: string
  }> {
    try {
      const paramsSearch = new URLSearchParams({
        chain: this.getChainType(params.chainId),
        limit: (params.limit || 20).toString(),
        cursor: params.cursor || '',
      })

      const res = await fetcher({
        url: `/${params.address}/nft/collections?${paramsSearch.toString()}`,
      })

      console.log({ getCollectionsByWallet: res?.data })

      return (
        res?.data || {
          page: 1,
          cursor: null,
          page_size: 20,
          result: [],
          status: 'FAILED',
        }
      )
    } catch (error) {
      return {
        page: 1,
        cursor: null,
        page_size: 20,
        result: [],
        status: 'FAILED',
      }
    }
  }
}

export default MoralisService
