import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'

const fetcher = (params: IFetch) => {
  let url = params?.url
  url = url.replace('/api/ether-scan/', '/')
  url = url.replace('//', '/')

  return fetcherConfig({
    baseUrl: 'https://api.etherscan.io/v2/api',
    headers: {
      accept: 'application/json',
    },
    ...params,
    url,
  })
}

export async function GET(request: Request) {
  try {
    let urlFinal: URL | string = new URL(request.url)
    urlFinal = urlFinal.toString().replace(urlFinal.origin, '')
    const res = await fetcher({
      url: urlFinal,
    })

    return Response.json(res)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    let urlFinal: URL | string = new URL(request.url)
    urlFinal = urlFinal.toString().replace(urlFinal.origin, '')
    const res = await fetcher({
      url: urlFinal,
      method: 'POST',
      body: await request.json(),
    })

    return Response.json(res)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
