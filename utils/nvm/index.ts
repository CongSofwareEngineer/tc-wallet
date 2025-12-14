import { CHAIN_DEFAULT } from '@/constants/chain'
import { TOKEN_NATIVE_OTHER } from '@/constants/token'
import { ChainId } from '@/types/web3'
import { isAddress as isAddressViem, zeroAddress } from 'viem'

export const isToken = (value: string): boolean => {
  if (value.startsWith('0x') && value.length === 42) {
    return true
  }
  return false
}

export const isTokenNative = (value: string = '', chainId?: ChainId): boolean => {
  if (chainId && TOKEN_NATIVE_OTHER[chainId]) {
    if (TOKEN_NATIVE_OTHER[chainId].includes(value)) {
      return true
    }
  }
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

export const isChainIdDefault = (chainId: ChainId) => {
  return CHAIN_DEFAULT.some((chain) => Number(chain.id) === Number(chainId))
}
