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

export async function GET(request: Request) {
  let urlFinal: URL | string = new URL(request.url)
  urlFinal = urlFinal.toString().replace(urlFinal.origin, '')
  urlFinal = urlFinal.toString().replace('/api/binance/', '/')
  urlFinal = `https://www.binance.com/api/v3${urlFinal}`
  const res = await fetch(`https://www.binance.com/api/v3${urlFinal}`)
  const data = await res.status
  return Response.json({ hello: 'world', urlFinal, res, data })
}
