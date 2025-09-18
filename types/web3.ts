import { TransactionRequest } from 'viem'

export type Hash = `0x${string}`
export type ChainId = string

export type Callback = {
  callbackSuccess?: (hash?: Hash) => void
  callbackError?: (error: any) => void
  callbackPending?: () => void
  callbackBefore?: () => void
}
export type RawTransactionEVM = TransactionRequest &
  Callback & {
    isTracking?: boolean
    chainId?: ChainId
    message?: any
    domain?: any
    types?: any
    primaryType?: string
  }
