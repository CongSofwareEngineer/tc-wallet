import { arbitrum, avalanche, base, bsc, linea, mainnet, optimism, polygon } from 'viem/chains'

export const CHAIN_MORALIS_SUPPORT = {
  [base.id]: 'base',
  [mainnet.id]: 'eth',
  [bsc.id]: 'bsc',
  [optimism.id]: 'optimism',
  [polygon.id]: '0x89',
  [linea.id]: 'linea',
  [avalanche.id]: 'avalanche',
  [arbitrum.id]: 'arbitrum',
}
