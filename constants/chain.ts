import { arbitrum, avalanche, base, bsc, linea, mainnet, optimism, optimismSepolia, polygon, zksync } from 'viem/chains'

export const CHAIN_DEFAULT = [
  {
    ...optimism,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
  {
    ...mainnet,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  },
  {
    ...polygon,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  },
  {
    ...avalanche,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  },
  {
    ...base,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  },
  {
    ...linea,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_linea.jpg',
  },
  {
    ...optimismSepolia,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
  {
    ...bsc,
    rpcUrls: {
      default: { http: ['https://public-bsc.nownodes.io'] },
    },
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  },
  {
    ...arbitrum,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  {
    ...polygon,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  },
  {
    ...zksync,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg',
  },
]
