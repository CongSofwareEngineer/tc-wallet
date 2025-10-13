import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'

const fetcher = (params: IFetch) => {
  return fetcherConfig({
    baseUrl: 'https://www.binance.com/api/v3',
    headers: {
      accept: 'application/json',
    },
    ...params,
  })
}

class BinanceService {
  static async getPriceBySymbol(symbol: string) {
    try {
      const res = await fetcher({
        url: `/ticker/price?symbol=${symbol}USDT`,
      })

      return res?.data?.price || 0
    } catch (error) {
      return 0
    }
  }
}

export default BinanceService
