import { isAddress as isAddressViem, zeroAddress } from 'viem'

export const isToken = (value: string): boolean => {
  let address = value
  if (address.startsWith('0x') && address.length === 42) {
    return true
  }
  return false
}

export const isTokenNative = (value: string = ''): boolean => {
  if (value === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' || value === '0x0000000000000000000000000000000000000000') {
    return true
  }
  return false
}

export const isAddress = (value: string): boolean => {
  let address = value
  if (isTokenNative(address)) {
    address = zeroAddress
  }

  return isAddressViem(address)
}
