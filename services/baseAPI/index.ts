import { IFetch, ReturnData } from '@/configs/fetcher/type'
import { KEY_STORAGE } from '@/constants/storage'
import { stringifyBigInt } from '@/utils/functions'
import { getSecureData } from '@/utils/secureStorage'

class BaseAPI {
  static baseUrl: string = process.env.NEXT_PUBLIC_API_URI || ''

  static async get<T = any>(options: IFetch): Promise<ReturnData<T>> {
    const { url, query = undefined, isProxy = false, ...config } = options

    try {
      const callUrl: URL = url?.includes('http') ? new URL(url) : new URL(url, isProxy ? `${window.origin}` : this.baseUrl)
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

      const fetchInit: RequestInit = {
        headers,
        method: 'GET',
        ...config,
      }

      const resFetch = await fetch(callUrl.href, fetchInit)

      if (!resFetch.ok) {
        throw new Error(`HTTP error! status: ${resFetch.status}`)
      }

      const resJson = await resFetch.json()

      // If response has data property, return it directly
      if (resJson?.data) {
        return resJson
      }

      // Otherwise wrap the response in data property
      return { data: resJson }
    } catch (error) {
      console.error('BaseAPI.get error:', error)
      throw error
    }
  }

  static async post<T = any>(options: IFetch): Promise<ReturnData<T>> {
    try {
      const { url, query = undefined, body = undefined, auth = undefined, throwError = false, isProxy = false, ...config } = options

      const callUrl: URL = url?.includes('http') ? new URL(url) : new URL(url, isProxy ? `${window.origin}` : this.baseUrl)
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

            return { result: null, statusCode: 401, data: null, message: 'Access token not found!' }
          }
        }
      }

      const fetchInit: RequestInit = {
        headers,
        method: 'POST',
        ...config,
      }

      if (body) {
        fetchInit.body = JSON.stringify(stringifyBigInt(body))
      }

      const resFetch = await fetch(callUrl.href, fetchInit)

      if (!resFetch.ok) {
        throw new Error(`HTTP error! status: ${resFetch.status}`)
      }

      const resJson = await resFetch.json()

      // If response has data property, return it directly
      if (resJson?.data) {
        return resJson
      }

      // Otherwise wrap the response in data property
      return { data: resJson }
    } catch (error) {
      throw error
    }
  }
}

export default BaseAPI
