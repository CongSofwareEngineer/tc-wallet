import * as ExpoCrypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import { MMKV } from 'react-native-mmkv'

import { SECURITY_CONFIG } from '@/constants/appConfig'
import { KEY_STORAGE } from '@/constants/storage'

export const checkSupportSecure = async () => {
  try {
    return SecureStore.canUseBiometricAuthentication()
  } catch {
    return false
  }
}

export const generateKey = () => {
  // byteLength = số byte random, 32 byte ~ 256-bit

  const randomBytes = ExpoCrypto.getRandomBytes(32)

  // Chuyển Uint8Array -> chuỗi Base64
  let binary = ''

  for (let i = 0; i < randomBytes.length; i++) {
    binary += String.fromCharCode(randomBytes[i])
  }

  return btoa(binary).replace(/\+-/g, '@').replace(/\//g, '@').slice(0, 16)
}

export const getKeyEncode = async () => {
  const isSupportSecure = await checkSupportSecure()
  if (isSupportSecure) {
    let encryptionKey = await SecureStore.getItemAsync(KEY_STORAGE.keyEncrypt, {
      authenticationPrompt: `Auth require ${KEY_STORAGE.keyEncrypt}`,
    })
    if (encryptionKey) {
      return encryptionKey
    } else {
      encryptionKey = generateKey()
      await SecureStore.setItemAsync(KEY_STORAGE.keyEncrypt, encryptionKey, {
        authenticationPrompt: `Auth require ${KEY_STORAGE.keyEncrypt}`,
      })
      return encryptionKey
    }
  } else {
    // Sử dụng key encode default từ app config thay vì environment variable
    return process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE || SECURITY_CONFIG.defaultKeyEncode
  }
}

const create = async () => {
  const encryptionKey = await getKeyEncode()

  const storage = new MMKV({ id: 'SECURE_LOCAL_STORAGE', encryptionKey })

  return storage
}

export const saveSecureData = async (key: KEY_STORAGE, value: any) => {
  try {
    const storage = await create()

    storage.set(key, JSON.stringify(value))
  } catch {
    return false
  }
}

export const getSecureData = async (key: KEY_STORAGE, defaultData: any = null) => {
  try {
    const storage = await create()
    const jsonValue = storage.getString(key) ?? ''

    return JSON.parse(jsonValue)
  } catch {
    return defaultData
  }
}

export const removeSecureData = async (key: KEY_STORAGE) => {
  try {
    const storage = await create()

    storage.delete(key)

    return true
  } catch {
    return false
  }
}
