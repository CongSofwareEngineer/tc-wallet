import { ChainId } from '@/types/web3'
import { polygon } from 'viem/chains'

export const TOKEN_NATIVE_OTHER = {
  [polygon.id]: ['0x0000000000000000000000000000000000001010'],
} as Record<ChainId, string[]>
