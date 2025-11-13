import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FilterState {
  tokens: {
    all: boolean
    hideSpam: boolean
    hideSmallBalances: boolean // balance < $0.001
    hideImported: boolean
  }
  nfts: {
    all: boolean
    hideSpam: boolean
  }
  collections: {
    all: boolean
    hideSpam: boolean
  }
}

const initialState: FilterState = {
  tokens: {
    all: true,
    hideSpam: false,
    hideSmallBalances: false,
    hideImported: false,
  },
  nfts: {
    all: true,
    hideSpam: false,
  },
  collections: {
    all: true,
    hideSpam: false,
  },
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload }
    },

    resetFilter: (state) => {
      state.tokens = initialState.tokens
      state.nfts = initialState.nfts
    },
    toggleTokenSpamFilter: (state) => {
      state.tokens.hideSpam = !state.tokens.hideSpam
    },
    toggleTokenBalanceFilter: (state) => {
      state.tokens.hideSmallBalances = !state.tokens.hideSmallBalances
    },
    toggleTokenImportedFilter: (state) => {
      state.tokens.hideImported = !state.tokens.hideImported
    },
    toggleNFTSpamFilter: (state) => {
      state.nfts.hideSpam = !state.nfts.hideSpam
    },
  },
})

export const { setFilter, resetFilter, toggleTokenSpamFilter, toggleTokenBalanceFilter, toggleTokenImportedFilter, toggleNFTSpamFilter } =
  filterSlice.actions
export default filterSlice.reducer
