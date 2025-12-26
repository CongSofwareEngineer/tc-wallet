import { Address } from '@/types/wallet'

export interface NFTResponse {
  status?: string
  page?: string
  page_size?: string
  cursor: string | null
  result: NFT[]
}
export type NFTType = 'ERC721' | 'ERC1155'
export interface NFT {
  amount: string
  token_id: string
  token_address: Address
  contract_type: NFTType
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

export interface Collection {
  token_address: Address
  possible_spam: boolean
  contract_type: NFTType
  name: string
  symbol: string
  verified_collection: boolean
  collection_logo: string | null
  collection_banner_image: string | null
  floor_price: string | null
  floor_price_usd: string | null
  floor_price_currency: string | null
}

export interface HistoryTxNFT {
  token_address: string
  token_id: string
  token_name: string
  token_symbol: string
  from_address_entity: string
  from_address_entity_logo: string
  from_address: string
  from_address_label: string
  to_address_entity: string
  to_address_entity_logo: string
  to_address: string
  to_address_label: string
  value: string
  amount: string
  contract_type: NFTType
  transaction_type: ''
  log_index: ''
  operator: string
  possible_spam: boolean
  verified_collection: boolean
  direction: 'outgoing' | 'incoming'
  collection_logo: string
  collection_banner_image: string
  normalized_metadata: string
}

export interface HistoryTxToken {
  token_name: string
  token_symbol: string
  token_logo: string
  token_decimals: string
  address: string
  block_timestamp: string
  to_address_entity: string
  to_address_entity_logo: string
  to_address: string
  to_address_label: string
  from_address_entity: string
  from_address_entity_logo: string
  from_address: string
  from_address_label: string
  value: string
  value_formatted: string
  log_index: string
  possible_spam: boolean
  verified_contract: boolean
}

export interface HistoryTxNativeToken {
  from_address_entity: string
  from_address_entity_logo: string
  from_address: string
  from_address_label: string
  to_address_entity: string
  to_address_entity_logo: string
  to_address: string
  to_address_label: string
  value: string
  value_formatted: string
  direction: 'outgoing' | 'incoming'
  internal_transaction: boolean
  token_symbol: string
  token_logo: string
}

export interface History {
  native_transfers: HistoryTxNativeToken[]
  erc20_transfers: HistoryTxToken[]
  nft_transfers: HistoryTxNFT[]
  method_label: string
  summary: string
  possible_spam: boolean
  category: string
  to_address: string
  value: string
  hash: string
  block_timestamp: string
}

export interface HistoryTx {
  status?: string
  page?: string
  page_size?: string
  cursor: string | null
  result: History[]
}
