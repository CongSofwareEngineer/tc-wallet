export type ITokenByChain = {
  address?: string
  symbol?: string
  name?: string
  decimals?: string

  logo?: string
  price?: string
  price_change_percentage_24h?: number | string
  market_cap_rank?: number
  market_cap?: number
  total_volume?: number
  tags?: any[]
  eip2612?: boolean
  [key: string]: unknown
}
