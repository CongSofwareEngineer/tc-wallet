import { MMKV } from 'react-native-mmkv'

const create = () => {
  const storage = new MMKV({ id: 'LOCAL_STORAGE', encryptionKey: process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE })

  return storage
}

export const getDataLocal = (key: string) => {
  try {
    const storage = create()
    const jsonValue = storage.getString(key) ?? ''

    return JSON.parse(jsonValue)
  } catch {
    return ''
  }
}

export const removeDataLocal = (key: string) => {
  try {
    const storage = create()

    storage.delete(key)

    return true
  } catch {
    return false
  }
}

export const saveDataLocal = (key: string, value: any) => {
  try {
    const storage = create()

    storage.set(key, JSON.stringify(value))

    return true
  } catch {
    return false
  }
}
