import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import MessageEN from '@/assets/languages/en.json'
import { KEY_REDUX } from '@/constants/redux'
import { KEY_STORAGE } from '@/constants/storage'
import { TYPE_LANGUAGE } from '@/types/language'
import { saveDataLocal } from '@/utils/storage'

export enum LANGUAGE_SUPPORT {
  VN = 'vn',
  EN = 'en',
}
type LanguageState = {
  locale: LANGUAGE_SUPPORT
  messages: TYPE_LANGUAGE
}

const initialState: LanguageState = {
  locale: LANGUAGE_SUPPORT.EN,
  messages: MessageEN,
}

const getLanguage = (language: LANGUAGE_SUPPORT): LanguageState => {
  switch (language) {
    case LANGUAGE_SUPPORT.EN:
      return {
        locale: LANGUAGE_SUPPORT.EN,
        messages: MessageEN,
      }

    default:
      return {
        locale: LANGUAGE_SUPPORT.VN,
        messages: MessageEN,
      }
  }
}

const languageSlice = createSlice({
  name: KEY_REDUX.Language,
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LANGUAGE_SUPPORT>) {
      state.locale = action.payload
      state.messages = getLanguage(action.payload).messages
      saveDataLocal(KEY_STORAGE.Language, action.payload)
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
