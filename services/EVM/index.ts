import { createPublicClient, Hex, http } from 'viem'
import { optimism } from 'viem/chains'

import { ChainId, RawTransactionEVM } from '@/types/web3'
const EVMServices = {
  getClient: (chainId: ChainId) => {
    const publicClient = createPublicClient({
      chain: optimism,
      transport: http(optimism.rpcUrls.default.http[0]),
    })

    return publicClient
  },
  estimateGas: async (transaction: RawTransactionEVM) => {
    const publicClient = EVMServices.getClient(transaction.chainId!)

    const account = transaction.from

    delete transaction.from

    const gas = await publicClient.estimateGas({
      account,
      ...transaction,
    })

    return gas
  },
  tracking: async (hash: Hex, chainId: ChainId, limit: number = 20) => {
    const publicClient = EVMServices.getClient(chainId)
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
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1500)) // wait for 1 second before checking again
      } finally {
        limitCurrent++
      }
    }
  },
}

export default EVMServices
