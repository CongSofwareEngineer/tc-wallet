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
    rpcUrls: {
      default: { http: ['https://polygon-bor-rpc.publicnode.com'] },
    },
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
    iconChain: 'https://static.bnbchain.org/home-ui/static/images/favicon.ico',
  },
  {
    ...arbitrum,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  {
    ...zksync,
    iconChain: 'https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg',
  },
]
