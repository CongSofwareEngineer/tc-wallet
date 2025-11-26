import { isAddress as isAddressViem, zeroAddress } from 'viem'

export const isToken = (value: string): boolean => {
  if (value.startsWith('0x') && value.length === 42) {
    return true
  }
  return false
}

export const isTokenNative = (value: string = ''): boolean => {
  if (value === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' || value === zeroAddress) {
    return true
  }
  return false
}

export const isAddress = (value: string): boolean => {
  if (isTokenNative(value)) {
    return true
  }

  return isAddressViem(value)
}
