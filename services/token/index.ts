import { erc20Abi } from 'viem'

import { store } from '@/redux/store'
import { ChainId } from '@/types/web3'
import { convertWeiToBalance } from '@/utils/functions'
import { isTokenNative } from '@/utils/nvm'

import Web3Service from '../web3'

class TokenService extends Web3Service {
  static async getTokenDecimals(addressToken: string, chainId: ChainId) {
    try {
      if (isTokenNative(addressToken)) {
        return 18
      } else {
        const publicClient = this.getClient(chainId)
        const decimals = await publicClient.readContract({
          address: addressToken as any,
          abi: erc20Abi,
          functionName: 'decimals',
        })

        return decimals
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getTokenBalance(addressToken: string, chainId: ChainId) {
    try {
      const wallet = store.getState().wallet.wallet
      const addressUser = wallet?.address
      const publicClient = this.getClient(chainId)
      if (isTokenNative(addressToken)) {
        const balance = await publicClient.getBalance({ address: addressUser as any, blockTag: 'latest' })

        return convertWeiToBalance(balance)
      } else {
        const decimals = await this.getTokenDecimals(addressToken, chainId)
        const balance = await publicClient.readContract({
          address: addressToken as any,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [addressUser as any],
        })

        return convertWeiToBalance(balance, decimals)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default TokenService
