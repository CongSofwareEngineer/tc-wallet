import { KEY_STORAGE } from '@/constants/storage'
import { getSecureData } from '@/utils/secureStorage'

import { IFetch, ReturnData } from './type'

const apiUri = process.env.NEXT_PUBLIC_API_URI || ''

export default async function fetcher<T = any>(options: IFetch): Promise<ReturnData<T>> {
  const { url, method = 'GET', query = undefined, body = undefined, auth = undefined, throwError = false, baseUrl = apiUri, ...config } = options
  const callUrl: URL = url?.includes('http') ? new URL(url) : new URL(url, baseUrl)

  if (query) {
    Object.keys(query).forEach((key) => {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]]

      values.forEach((v: any) => {
        if (callUrl.searchParams.has(key)) {
          callUrl.searchParams.append(key, v)
        } else {
          callUrl.searchParams.set(key, v)
        }
      })
    })
  }

  const headers = new Headers({
    'content-type': 'application/json',
    accept: 'application/json',
  })

  if (auth) {
    if (typeof auth === 'string') {
      headers.set('Authorization', `Bearer ${auth}`)
    } else {
      const accessToken = await getSecureData(KEY_STORAGE.AccessToken)

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      } else {
        if (throwError) {
          throw new Error('Access token not found!')
        }

        return { statusCode: 401, data: null, message: 'Access token not found!' }
      }
    }
  }

  const fetchInit: RequestInit = {
    headers,
    method,
    ...config,
  }

  if (body) {
    fetchInit.body = JSON.stringify(body)
  }

  const resFetch = await fetch(callUrl.href, fetchInit)

  const resJson = await resFetch.json()

  // console.log('🚀 ~ resJson:', resJson)
  // console.log('🚀 ~ resJson:', resJson)

  // if (resJson.statusCode === 200 || resJson.status === 200) {
  //   return resJson
  // }

  // console.log(resJson)
  // if (showError) {
  //   if (resJson?.message) {
  //     showNotificationError(resJson?.message)
  //   } else {
  //     showNotificationError('API Error')
  //   }
  // }

  if (throwError) {
    throw Error(resJson?.message)
  }

  return resJson
}
