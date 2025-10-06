import { useDispatch } from 'react-redux'

import { KEY_STORAGE } from '@/constants/storage'
import { useAppSelector } from '@/redux/hooks'
import {
  removeAllPassphrases as removeAllPassphrasesSlice,
  removePassPhrase as removePassPhraseSlice,
  setPassPhrase as setPassPhraseSlice,
} from '@/redux/slices/passPhaseSlice'
import { Wallet } from '@/types/wallet'
import { cloneDeep } from '@/utils/functions'
import { removeSecureData, saveSecureData } from '@/utils/secureStorage'

import useWallets from './useWallets'

const usePassPhrase = () => {
  const { setWallets, wallets } = useWallets()
  const passPhase = useAppSelector((state) => state.passPhase)
  const dispatch = useDispatch()

  const setPassPhrase = async (value: string) => {
    const arr = [...passPhase, value]
    dispatch(setPassPhraseSlice(value))
    await saveSecureData(KEY_STORAGE.Mnemonic, arr)
  }

  const addPassPhrase = async (value: string) => {
    const arr = [...passPhase, value]
    dispatch(setPassPhraseSlice(value))
    await saveSecureData(KEY_STORAGE.Mnemonic, arr)
  }

  const removePassPhrase = async (index: number) => {
    let walletsClone = cloneDeep<Wallet[]>(wallets)
    let passPhaseClone = cloneDeep<string[]>(passPhase)

    // Save the updated passphrase list
    passPhaseClone = passPhaseClone.filter((_, idx) => idx !== index)
    await saveSecureData(KEY_STORAGE.Mnemonic, passPhaseClone)

    // Remove associated wallets
    walletsClone = walletsClone.filter((wallet) => {
      return wallet.indexMnemonic !== index
    })
    walletsClone[0].isDefault = true

    // Update Redux store
    dispatch(removePassPhraseSlice(index))
    setWallets(walletsClone)
  }

  const removeAllPassphrases = async () => {
    dispatch(removeAllPassphrasesSlice())
    setWallets([])
    await removeSecureData(KEY_STORAGE.Mnemonic)
  }

  return {
    setPassPhrase,
    removePassPhrase,
    removeAllPassphrases,
    addPassPhrase,
    passPhase,
  }
}

export default usePassPhrase
