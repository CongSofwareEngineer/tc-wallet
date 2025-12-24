import CryptoJS from 'crypto-js'

const getIV = () => {
  return CryptoJS.enc.Hex.parse('1232345423456789') // 16 bytes IV
}

export const encodeData = async (value: any, password?: string) => {
  try {
    const keyEncode = password || process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE
    const text = JSON.stringify(value)
    const encryptedValue = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(keyEncode), {
      iv: getIV(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
    return encryptedValue
  } catch {
    return null
  }
}

export const decodeData = async (value: any, password?: string) => {
  try {
    const keyEncode = password || process.env.EXPO_PUBLIC_KEY_ENCODE_STORAGE
    const bytes = CryptoJS.AES.decrypt(value.toString(), CryptoJS.enc.Utf8.parse(keyEncode), {
      iv: getIV(),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedValue)
  } catch {
    return null
  }
}
