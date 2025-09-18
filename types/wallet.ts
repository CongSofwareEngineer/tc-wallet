import { Hex } from "viem"

export type Address = string

export type WalletType = 'evm' | 'solana' | 'aptos' | 'starknet' | 'near'

export interface Wallet {
  address: Address
  name?: string
  isNfc?: boolean
  private: Hex
  isSmartAccount?: boolean
  isSmart7702?: boolean
  type: WalletType
}

export interface WalletConnect {
  address: `0x${string}`
  name?: string
  isNfc?: boolean
  private: Hex
}