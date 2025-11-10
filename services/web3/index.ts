import BigNumber from 'bignumber.js'
import { createPublicClient, Hex, http } from 'viem'

import { CHAIN_DEFAULT } from '@/constants/chain'
import { store } from '@/redux/store'
import { ChainId } from '@/types/web3'

class Web3Service {
  static getClient(chainId: ChainId) {
    const listChain = store.getState().chains
    let chain: any = CHAIN_DEFAULT.find((item) => item.id.toFixed() === chainId.toString())
    if (!chain) {
      chain = listChain.find((item) => item.id.toFixed() === chainId.toString())
    }

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(chain!.rpcUrls.default.http[0]),
    })

    return publicClient
  }

  static async getGasPrice(chainId: ChainId, multiplier?: number): Promise<bigint> {
    const publicClient = this.getClient(chainId)
    const gasPriceBase = await publicClient.getGasPrice()

    const gasPrice = BigNumber(gasPriceBase)
      .multipliedBy(multiplier || 1.05)
      .decimalPlaces(0)
      .toFixed()
    return BigInt(gasPrice)
  }

  static async tracking(hash: Hex, chainId: ChainId, limit: number = 20) {
    const publicClient = this.getClient(chainId)
    let limitCurrent = 0
    while (true) {
      try {
        if (limitCurrent++ >= limit) {
          return true
        }

        const receipt = await publicClient.getTransactionReceipt({
          hash,
        })

        if (receipt) {
          return receipt
        }
        await new Promise((resolve) => setTimeout(resolve, 1500)) // wait for 1 second before checking again
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1500)) // wait for 1 second before checking again
      } finally {
        limitCurrent++
      }
    }
  }
}

export default Web3Service
