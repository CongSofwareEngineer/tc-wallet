import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import MessageEN from '@/assets/languages/en.json'
import { KEY_STORAGE } from '@/constants/storage'
import { TYPE_LANGUAGE } from '@/types/language'
import { getDataLocal, removeDataLocal, saveDataLocal } from '@/utils/storage'

enum LANGUAGE_SUPPORT {
  VN = 'vn',
  EN = 'en',
}
type LanguageState = {
  language: {
    locale: LANGUAGE_SUPPORT
    messages: TYPE_LANGUAGE
  }
  setLanguage: (locale: keyof typeof LANGUAGE_SUPPORT) => void
}

type Language = {
  locale: LANGUAGE_SUPPORT
  messages: TYPE_LANGUAGE
}

const getLanguage = (language: LANGUAGE_SUPPORT): Language => {
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

export const languageZustand = create<LanguageState>()(
  devtools(
    persist(
      (set) => ({
        language: {
          locale: LANGUAGE_SUPPORT.EN,
          messages: MessageEN,
        },

        setLanguage: (locale: keyof typeof LANGUAGE_SUPPORT) => {
          const language = getLanguage(locale as any)

          set({ language })
        },
      }),
      {
        storage: {
          getItem: () => {
            const local = getDataLocal(KEY_STORAGE.Language)

            if (local) {
              const language = getLanguage(local)

              return {
                state: {
                  language,
                },
              }
            }

            return null
          },
          removeItem: () => {
            removeDataLocal(KEY_STORAGE.Language)
          },
          setItem: (_, value) => {
            const locale = value.state.language.locale

            saveDataLocal(KEY_STORAGE.Language, locale)
          },
        },
        name: 'language-zustand',
      }
    ),
    {
      name: 'language-zustand',
      enabled: process.env.EXPO_PUBLIC_ENV !== 'production',
    }
  )
)
