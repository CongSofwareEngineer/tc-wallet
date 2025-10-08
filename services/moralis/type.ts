export type Token = {
  token_address: string
  symbol: string
  name: string
  logo: string
  thumbnail: string
  decimals: number
  balance: string
  possible_spam: boolean
  verified_contract: boolean
  total_supply: string | null
  total_supply_formatted: string | null
  percentage_relative_to_total_supply: string | null
  security_score: number
  balance_formatted: string
  usd_price: number
  usd_price_24hr_percent_change: number
  usd_price_24hr_usd_change: number
  usd_value: number
  usd_value_24hr_usd_change: number
  native_token: boolean
  portfolio_percentage: number
}
