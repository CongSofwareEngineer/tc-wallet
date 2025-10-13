import { configureStore } from '@reduxjs/toolkit'

import filterReducer from './slices/filterSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    // Thêm các reducer khác ở đây
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
