export enum KEY_REDUX {
  Language = 'language',
  Modals = 'modals',
  Wallet = 'wallet',
  Sessions = 'sessions',
  Mode = 'mode',
  RequestWC = 'requestWC',
  ChainSelected = 'chainSelected',
}

export const WHITE_LIST_STORAGE = [KEY_REDUX.Wallet, KEY_REDUX.Mode, KEY_REDUX.ChainSelected]
