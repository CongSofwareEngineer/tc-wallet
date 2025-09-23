import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { resetWallets as resetWalletsSlice, setWallet as setWalletSlice, setWallets as setWalletsSlice } from '@/redux/slices/walletSlice'
import { Wallet } from '@/types/wallet'

const useWallets = () => {
  const dispatch = useDispatch()
  const { wallets, wallet } = useAppSelector((state) => state.wallet)

  const setWallet = (wallet: Wallet, index: number) => {
    dispatch(setWalletSlice({ wallet, index }))
  }

  const setWallets = (wallets: Wallet[]) => {
    dispatch(setWalletsSlice(wallets))
  }

  const resetWallets = () => {
    dispatch(resetWalletsSlice())
  }

  return {
    setWallet,
    resetWallets,
    setWallets,
    wallets,
    wallet,
  }
}

export default useWallets
