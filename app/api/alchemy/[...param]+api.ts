import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { APP_CONFIG } from '@/constants/appConfig'

const fetcher = (params: IFetch) => {
  let url = params?.url?.replace('apiKey', APP_CONFIG.apiKeyAlchemy || '')
  url = url.replace('//', '/')
  url = url.replace('/api/alchemy/', '/')

  return fetcherConfig({
    baseUrl: 'https://api.g.alchemy.com/',
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
