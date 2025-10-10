import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { resetWallets as resetWalletsSlice, setWallet as setWalletSlice, setWallets as setWalletsSlice } from '@/redux/slices/walletSlice'
import { Wallet } from '@/types/wallet'
import { cloneDeep } from '@/utils/functions'

const useWallets = () => {
  const dispatch = useDispatch()
  const { wallets, wallet } = useAppSelector((state) => state.wallet)

  const indexWalletActive = useMemo(() => {
    return wallets.findIndex((w) => w.isDefault)
  }, [wallets])

  const setWallet = (wallet: Wallet, index: number) => {
    dispatch(setWalletSlice({ wallet, index }))
  }

  const setWalletActive = (indexDefault: number) => {
    const walletClone = cloneDeep<Wallet[]>(wallets)
    walletClone.forEach((w, index) => {
      walletClone[index].isDefault = index === indexDefault
    })
    dispatch(setWalletsSlice(walletClone))
  }

  const setWallets = (wallets: Wallet[]) => {
    dispatch(setWalletsSlice(wallets))
  }

  const resetWallets = () => {
    dispatch(resetWalletsSlice())
  }

  const addWallet = (wallet: Wallet) => {
    const walletClone = cloneDeep<Wallet[]>(wallets)
    walletClone.forEach((w, index) => {
      walletClone[index].isDefault = false
    })
    dispatch(setWalletsSlice([...walletClone, wallet]))
  }

  return {
    setWallet,
    resetWallets,
    addWallet,
    setWallets,
    setWalletActive,
    wallets,
    wallet,
    indexWalletActive,
  }
}

export default useWallets
