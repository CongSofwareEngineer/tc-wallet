import { Hex } from 'viem'

export type Address = string

export type WalletType = 'evm' | 'solana' | 'aptos' | 'starknet' | 'near'

export type ListMnemonic = string[]

export interface Wallet {
  address: Address
  name?: string
  isNfc?: boolean
  private: Hex
  isSmartAccount?: boolean
  isSmart7702?: boolean
  type: WalletType
  indexMnemonic?: number // which account index in mnemonic derivation
}

export interface WalletConnect {
  address: `0x${string}`
  name?: string
  isNfc?: boolean
  private: Hex
}
