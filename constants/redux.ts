export enum KEY_REDUX {
  Language = 'language',
  Modals = 'modals',
  Wallet = 'wallet',
  Sessions = 'sessions',
  Mode = 'mode',
  RequestWC = 'requestWC',
  ChainSelected = 'chainSelected',
  Chains = 'chains',
  Settings = 'settings',
  Filter = 'filter',
}

export const WHITE_LIST_STORAGE = [
  KEY_REDUX.Wallet,
  KEY_REDUX.Mode,
  KEY_REDUX.Chains,
  KEY_REDUX.ChainSelected,
  KEY_REDUX.Sessions,
  KEY_REDUX.Settings,
  KEY_REDUX.Filter,
]
