import { KEY_STORAGE } from '@/constants/storage'
import * as SecureStore from 'expo-secure-store'
import { MMKV } from 'react-native-mmkv'

export const checkSupportSecure = async () => {
  try {
    return SecureStore.canUseBiometricAuthentication()
  } catch {
    return false
  }
}

export const generateKey = () => {
  // byteLength = số byte random, 32 byte ~ 256-bit

  const randomBytes = []

  for (let i = 0; i < 64; i++) {
    randomBytes.push(Math.floor(Math.random() * 256))
  }

  // Chuyển Uint8Array -> chuỗi Base64
  let binary = ''

  for (let i = 0; i < randomBytes.length; i++) {
    binary += String.fromCharCode(randomBytes[i])
  }

  return btoa(binary).replace(/\+-/g, '@').replace(/\//g, '@').slice(0, 16)
}

const create = async () => {
  let encryptionKey: string | null = process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE as string
  const isSupport = await checkSupportSecure()

  if (isSupport) {
    encryptionKey = await SecureStore.getItemAsync(KEY_STORAGE.keyEncrypt, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
      authenticationPrompt: `Auth require ${KEY_STORAGE.keyEncrypt}`,
    })

    if (!encryptionKey) {
      encryptionKey = generateKey()
      SecureStore.setItemAsync(KEY_STORAGE.keyEncrypt, encryptionKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
        authenticationPrompt: `Auth require ${KEY_STORAGE.keyEncrypt}`,
      })
    }
  }

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