import { images } from '@/configs/images'
import { BRIDE_API } from '@/constants/debridge'
import { ChainId } from '@/types/web3'
import { isTokenNative } from '@/utils/nvm'
import { zeroAddress } from 'viem'
import { arbitrum, base, linea, optimism, zksync } from 'viem/chains'
import BaseAPI from '../baseAPI'
import { Token } from '../moralis/type'
import { ITokenByChain } from './type'

class DeBridgeServices extends BaseAPI {
  static formatChainType(chainType: string): string {
    const CHAIN_SUPPORT = {
      polygon: 'matic',
      ethereum: 'ether',
      avalanche: 'avax',
    }
    return CHAIN_SUPPORT[chainType as keyof typeof CHAIN_SUPPORT] || chainType
  }

  static convertTokenMoralis(chainId: ChainId, token: ITokenByChain) {
    const tokenFinal: Partial<Token> = {
      decimals: Number(token.decimals || '18'),
      logo: token.logoURI || images.icons.unknown,
      thumbnail: token.logoURI || images.icons.unknown,
      name: token.name!,
      symbol: token.symbol!,
      token_address: token.address!,
      usd_price: Number(token.price || '0'),
      usd_price_24hr_percent_change: Number(token.price_change_percentage_24h || '0'),
      usd_price_24hr_usd_change: Number(token.price_change_percentage_24h || '0'),
    }
    if (
      chainId?.toString() === arbitrum.id.toString() ||
      chainId?.toString() === base.id.toString() ||
      chainId?.toString() === optimism.id.toString() ||
      chainId?.toString() === zksync.id.toString() ||
      chainId?.toString() === linea.id.toString()
    ) {
      if (isTokenNative(tokenFinal.token_address)) {
        tokenFinal.logo = tokenFinal.thumbnail = 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg'
      }
    }

    return tokenFinal
  }
  static async getListTokenByChain(chainId: ChainId, textSearch: string | string[] = ''): Promise<Token[]> {
    let arr: ITokenByChain[] = []
    if (textSearch) {
      const res = await this.get({
        url: `https://wallet-api.pantograph.app/token-list?chainId=${chainId}&key=${textSearch}`,
      })
      arr = Object.values(res ?? []) as ITokenByChain[]
    } else {
      const [listDebridge, listTokens] = await Promise.all([
        this.get({
          url: `${BRIDE_API.DLN_API}/v1.0/token-list?chainId=${chainId}&accesstoken=d6c45897b8f6`,
        }),
        this.get({
          url: `https://wallet-api.pantograph.app/token-list?chainId=${chainId}`,
        }),
      ])
      const arrTokenDeb = Object.values(listDebridge?.data?.tokens ?? []) as ITokenByChain[]
      const arrTokens = Object.values(listTokens?.data?.data ?? []) as ITokenByChain[]

      arr = Array.from(new Map([...arrTokenDeb, ...arrTokens].map((item) => [item.address, item])).values())
    }

    const listToken = arr.map((token) => {
      token.address = token?.address || (token?.token_address as string)
      token.logo = token?.logoURI || token?.logo || images.icons.unknown

      if (isTokenNative(token.address)) {
        token.address = zeroAddress
        token.logo = images.tokens.ethIcon
      }
      return token
    })
    const arrFormat = listToken.map((token) => {
      return this.convertTokenMoralis(chainId, token) as unknown as Token
    })
    return arrFormat
  }
}

export default DeBridgeServices
