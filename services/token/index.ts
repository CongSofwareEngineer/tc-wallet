import { erc20Abi } from 'viem'

import { store } from '@/redux/store'
import { ChainId } from '@/types/web3'
import { convertWeiToBalance } from '@/utils/functions'
import { isChainIdDefault, isTokenNative } from '@/utils/nvm'

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

  static async getTokenSymbol(addressToken: string, chainId: ChainId) {
    try {
      if (isTokenNative(addressToken)) {
        return 'TC'
      } else {
        const publicClient = this.getClient(chainId)
        const symbol = await publicClient.readContract({
          address: addressToken as any,
          abi: erc20Abi,
          functionName: 'symbol',
        })

        return symbol
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getTokenName(addressToken: string, chainId: ChainId) {
    try {
      if (isTokenNative(addressToken)) {
        return 'TC'
      } else {
        const publicClient = this.getClient(chainId)
        const name = await publicClient.readContract({
          address: addressToken as any,
          abi: erc20Abi,
          functionName: 'name',
        })

        return name
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getBalanceToken(addressToken: string, chainId: ChainId) {
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

  static async getListBalanceToken(addressTokens: string[], chainId: ChainId) {
    try {
      const publicClient = this.getClient(chainId)
      const isChainDefault = isChainIdDefault(chainId)
      const wallet = store.getState().wallet.wallet
      const addressUser = wallet?.address

      if (isChainDefault) {
        const arrCall: any[] = []
        addressTokens.forEach((item) => {
          arrCall.push({
            address: item as any,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [addressUser as any],
          })
        })
        const res = await publicClient.multicall({
          contracts: arrCall as any[],
        })
        return res.map((item) => convertWeiToBalance(item.result?.toString() as string))
      } else {

        const res = await Promise.all(addressTokens.map((addressToken) => this.getBalanceToken(addressToken, chainId)))
        return res.map((item) => convertWeiToBalance(item?.toString() as string))
      }



    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getInfoToken(addressToken: string, chainId: ChainId) {
    try {
      const publicClient = this.getClient(chainId)

      const isChainDefault = isChainIdDefault(chainId)
      if (isChainDefault) {
        const res = await publicClient.multicall({

          contracts: [
            {
              address: addressToken as any,
              abi: erc20Abi,
              functionName: 'symbol',
            },
            {
              address: addressToken as any,
              abi: erc20Abi,
              functionName: 'decimals',
            },
            {
              address: addressToken as any,
              abi: erc20Abi,
              functionName: 'name',
            },

          ]
        })
        const symbol = res[0].result
        const decimals = res[1].result
        const name = res[2].result

        return { symbol, decimals, name }
      } else {
        const [symbol, decimals, name] = await Promise.all([
          this.getTokenSymbol(addressToken, chainId),
          this.getTokenDecimals(addressToken, chainId),
          this.getTokenName(addressToken, chainId),
        ])

        return { symbol, decimals, name }
      }

    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default TokenService
