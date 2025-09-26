import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { KEY_STORAGE } from '@/constants/storage'
import { setListPassPhrase } from '@/redux/slices/passPhaseSlice'
import { getSecureData } from '@/utils/secureStorage'

const usePreLoadData = () => {
  const dispatch = useDispatch()

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
}

export default usePreLoadData
