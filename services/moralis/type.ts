export interface NFTResponse {
  status: string
  page: string
  page_size: string
  cursor: string
  result: NFT[]
}

export interface NFT {
  token_address: string
  token_id: string
  contract_type: string
  owner_of: string
  block_number: string
  block_number_minted: string
  token_uri: string
  metadata: string
  normalized_metadata: string
  media: string
  amount: string
  name: string
  symbol: string
  token_hash: string
  rarity_rank: number
  rarity_percentage: number
  rarity_label: string
  last_token_uri_sync: string
  last_metadata_sync: string
  possible_spam: string
  verified_collection: string
  floor_price: string
  floor_price_usd: string
  floor_price_currency: string
  last_sale?: {
    transaction_hash: string
    block_timestamp: string
    buyer_address: string
    seller_address: string
    price: string
    price_formatted: string
    usd_price_at_sale: string
    current_usd_value: string
    token_address: string
    token_id: string
  }
}

export interface Token {
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
  is_imported: boolean
}
