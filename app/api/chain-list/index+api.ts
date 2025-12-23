import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'

const fetcher = (params: IFetch) => {
  let url = params?.url
  url = url.replace('/api/chain-list/', '/')
  url = url.replace('//', '/')

  return fetcherConfig({
    baseUrl: 'https://chainlist.org/',
    headers: {
      accept: 'application/json',
    },
    ...params,
    url,
  })
}

export async function GET(request: Request) {
  try {
    const res = await fetcher({
      url: '/rpcs.json',
    })
    const data = await res.data
    return Response.json({ data })
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
