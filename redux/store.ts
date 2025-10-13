import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import { WHITE_LIST_STORAGE } from '@/constants/redux'
import alertReducer from '@/redux/slices/alertSlice'
import chainSelectedReducer from '@/redux/slices/chainSelected'
import chainsReducer from '@/redux/slices/chainSlice'
import languageReducer from '@/redux/slices/languageSlice'
import modalReducer from '@/redux/slices/modalSlice'
import modeReducer from '@/redux/slices/mode'
import passPhaseSlice from '@/redux/slices/passPhaseSlice'
import requestWCSlice from '@/redux/slices/requestWC'
import sessionsReducer from '@/redux/slices/sessionsSlice'
import settingsSlice from '@/redux/slices/settingsSlice'
import sheetReducer from '@/redux/slices/sheetSlice'
import walletReducer from '@/redux/slices/walletSlice'
import filterSlice from '@/store/slices/filterSlice'
import { getDataLocal, removeDataLocal, saveDataLocal } from '@/utils/storage'

const rootPersistConfig = {
  key: 'tc-wallet',
  storage: {
    getItem: async (key: string) => {
      const value = await getDataLocal(key)
      return value
    },
    setItem: async (key: string, value: any) => {
      saveDataLocal(key, value)
    },
    removeItem: async (key: string) => {
      removeDataLocal(key)
    },
  },
  version: 1,
  whitelist: WHITE_LIST_STORAGE,
}

const rootReducer = combineReducers({
  language: languageReducer,
  modals: modalReducer,
  wallet: walletReducer,
  sessions: sessionsReducer,
  mode: modeReducer,
  requestWC: requestWCSlice,
  passPhase: passPhaseSlice,
  chainSelected: chainSelectedReducer,
  sheet: sheetReducer,
  chains: chainsReducer,
  settings: settingsSlice,
  alert: alertReducer,
  filter: filterSlice,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.EXPO_PUBLIC_ENV !== 'production',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
