import { ChainId } from '@/types/web3'
import { arbitrum, base, bsc, linea, mainnet, optimism, polygon } from 'viem/chains'

export const ADDRESS_AFFILIATE = '0x9f276af79b2b5de2946a88b0fe2717318f924d7c' as const

export const AFFILIATE_FEE_PERCENT = 0.2

export const REFERRAL_CODE = 12052000

export const BRIDE_API = {
  DLN_API: 'https://dln.debridge.finance',
  TOKEN_LIST: 'https://tokens.1inch.io/v1.1',
  TOKEN_PRICE: 'https://token-prices.1inch.io/v1.1',
  DLN_TRADE_DETAIL: 'https://app.debridge.finance/order?orderId=',
  TERMS_OF_USE: 'https://debridge.finance/assets/files/debridge_terms_of_service.pdf',
  PRIVACY_POLICY: 'https://debridge.finance/assets/files/debridge_privacy_policy.pdf',
}

export const LIST_TOKEN_DEFAULT = {
  [mainnet.id]: ['ETH', 'USDC', 'USDT', 'WBTC', 'WETH'],
  [optimism.id]: ['ETH', 'USDC', 'USDT', 'WBTC', 'WETH'],
  [base.id]: ['ETH', 'USDC', 'USDT'],
  [arbitrum.id]: ['ETH', 'USDC', 'USDT'],
  [polygon.id]: ['POL', 'USDC', 'USDT'],
  [bsc.id]: ['BNB', 'USDC', 'USDT'],
  [linea.id]: ['ETH', 'USDC', 'USDT'],
} as Record<ChainId, string[]>
