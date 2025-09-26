// Polyfill for crypto.getRandomValues in React Native/Expo
// Ensures libraries like walletconnect/viem can request random bytes
import * as ExpoCrypto from 'expo-crypto'

import 'react-native-get-random-values'

// If no global crypto, attach a minimal one
const g: any = globalThis as any
// Attach on all common roots
if (typeof g.crypto === 'undefined') {
  g.crypto = {}
}
try {
  // @ts-ignore
  if (typeof global !== 'undefined' && !(global as any).crypto) {
    // @ts-ignore
    ; (global as any).crypto = g.crypto
  }
  // @ts-ignore
  if (typeof window !== 'undefined' && !(window as any).crypto) {
    // @ts-ignore
    ; (window as any).crypto = g.crypto
  }
} catch { }

// Provide getRandomValues if missing
if (typeof (g.crypto as any).getRandomValues !== 'function') {
  ; (g.crypto as any).getRandomValues = (typedArray: ArrayBufferView) => {
    const length = typedArray.byteLength
    const random = ExpoCrypto.getRandomBytes(length)
    const bytes = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
    bytes.set(random)
    return typedArray
  }
}

export { }

