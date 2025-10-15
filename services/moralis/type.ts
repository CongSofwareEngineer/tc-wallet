export interface NFTResponse {
  status?: string
  page?: string
  page_size?: string
  cursor: string | null
  result: NFT[]
}

export interface NFT {
  amount: string
  token_id: string
  token_address: string
  contract_type: string
  owner_of: string
  last_metadata_sync: string
  last_token_uri_sync: string
  metadata: string
  block_number: string
  block_number_minted: string
  name: string
  symbol: string | null
  token_hash: string
  token_uri: string
  minter_address: string
  rarity_rank: number
  rarity_percentage: number
  rarity_label: string
  verified_collection: boolean
  possible_spam: boolean
  normalized_metadata: {
    name: string
    description: string
    animation_url: string | null
    external_link: string | null
    external_url: string | null
    image: string
    attributes: any[]
  }
  collection_logo: string | null
  collection_banner_image: string | null
  collection_category: string | null
  project_url: string | null
  wiki_url: string | null
  discord_url: string | null
  telegram_url: string | null
  twitter_username: string | null
  instagram_username: string | null
  list_price: {
    listed: false
    price: string | null
    price_currency: string | null
    price_usd: string | null
    marketplace: string | null
  }
  floor_price: string | null
  floor_price_usd: string | null
  floor_price_currency: string | null
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
