import { KEY_STORAGE } from '@/constants/storage'

import { decodeData, encodeData } from '../crypto'

export const checkSupportSecure = async () => {
  return true
}

export const generateKey = () => {
  return process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE
}

export const getKeyEncode = async () => {
  return process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE as string
}

const create = async () => {
  return window.localStorage
}

export const saveSecureData = async (key: KEY_STORAGE, value: any) => {
  try {
    const storage = await create()
    const data = await encodeData(JSON.stringify(value))

    storage.setItem(key, data as any)
  } catch {
    return false
  }
}

export const getSecureData = async (key: KEY_STORAGE, defaultData: any = null) => {
  try {
    const storage = await create()
    const jsonValue = storage.getItem(key) ?? ''
    console.log({ jsonValue })

    const data = await decodeData(jsonValue)
    return JSON.parse(data)
  } catch {
    return defaultData
  }
}

export const removeSecureData = async (key: KEY_STORAGE) => {
  try {
    const storage = await create()

    storage.removeItem(key)

    return true
  } catch {
    return false
  }
}
