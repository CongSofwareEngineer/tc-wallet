import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import { WHITE_LIST_STORAGE } from '@/constants/redux'
import languageReducer from '@/redux/slices/languageSlice'
import modalReducer from '@/redux/slices/modalSlice'
import modeReducer from '@/redux/slices/mode'
import requestWCSlice from '@/redux/slices/requestWC'
import sessionsReducer from '@/redux/slices/sessionsSlice'
import walletReducer from '@/redux/slices/walletSlice'
import { getDataLocal, removeDataLocal, saveDataLocal } from '@/utils/storage'

const rootPersistConfig = {
  key: 'root',
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
