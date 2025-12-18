import { Platform } from 'react-native'

import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { APP_CONFIG } from '@/constants/appConfig'
import { uppercase } from '@/utils/functions'

const fetcher = (params: IFetch) => {
  let url = 'api/alchemy/' + (params?.url || '')
  url = url.replace('//', '/')

  if (Platform.OS !== 'web') {
    url = url.replace('api/alchemy/', '/')
    url = url.replace('apiKey', APP_CONFIG.apiKeyAlchemy || '')
  }

  return fetcherConfig({
    baseUrl: Platform.OS === 'web' ? `${window.origin}` : 'https://api.g.alchemy.com',
    headers: {
      accept: 'application/json',
    },
    ...params,
    url,
  })
}

class AlchemyService {
  static async getPriceBySymbol(symbol: string): Promise<string> {
    try {
      if (uppercase(symbol) === 'MATIC') {
        symbol = 'POL'
      }
      const res = await fetcher({
        url: `/prices/v1/apiKey/tokens/by-symbol?symbols=${symbol}`,
      })

      if (Array.isArray(res?.data)) {
        const tokenData = res.data.find((item: any) => item.symbol.toLowerCase() === symbol.toLowerCase())

        return tokenData?.prices[0]?.value || '0'
      }

      return res?.data?.price || '0'
    } catch (error) {
      console.log({ errorgetPriceBySymbol: error })

      return '0'
    }
  }

  static async getPriceByAddress(address: string, chainId: number) {
    try {
      const res = await fetcher({
        url: 'prices/v1/apiKey/tokens/by-address',
        method: 'POST',
        body: {
          address,
          network: chainId.toString(),
        },
      })

      return res?.data?.price || 0
    } catch (error) {
      return 0
    }
  }
}

export default AlchemyService
