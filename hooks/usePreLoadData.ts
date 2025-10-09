import { useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'

import { KEY_STORAGE } from '@/constants/storage'
import { setListPassPhrase } from '@/redux/slices/passPhaseSlice'
import { getSecureData } from '@/utils/secureStorage'
import { getDataLocal } from '@/utils/storage'

import useLanguage from './useLanguage'

const usePreLoadData = () => {
  const dispatch = useDispatch()
  const { setLanguage } = useLanguage()

  useEffect(() => {
    const init = async () => {
      const [mnemonics] = await Promise.all([getSecureData(KEY_STORAGE.Mnemonic)])
      if (mnemonics) {
        dispatch(setListPassPhrase(mnemonics))
      }

      // dispatch to store if needed
    }
    init()
  }, [dispatch])

  useLayoutEffect(() => {
    const local = getDataLocal(KEY_STORAGE.Language)
    if (local) {
      setLanguage(local)
    }
  }, [])
}

export default usePreLoadData
