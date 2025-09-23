import { Hex } from 'viem'

export type Address = string

export type ListMnemonic = string[]

export interface Wallet {
  address: Address
  addressSolana?: string
  addressBTC?: string
  name?: string
  isNfc?: boolean
  privateKey: Hex
  isSmartAccount?: boolean
  isSmart7702?: boolean
  indexMnemonic?: number // which account index in mnemonic derivation
  indexAccountMnemonic?: number // which account index in mnemonic derivation
  isDefault?: boolean
}

export interface WalletConnect {
  address: `0x${string}`
  name?: string
  isNfc?: boolean
  private: Hex
}
