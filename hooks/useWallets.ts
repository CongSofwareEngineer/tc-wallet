import { walletsZustand } from '@/zustand/wallet'

const useWallets = () => {
  const wallets = walletsZustand((state) => state)
  return wallets
}

export default useWallets
