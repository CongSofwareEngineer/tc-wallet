import { ChainId } from "@/types/web3"
import { createPublicClient, Hex, http, TransactionRequest } from "viem"
import { optimism } from 'viem/chains'
const EVMServices = {
  getClient: (chainId: number) => {
    const publicClient = createPublicClient({
      chain: optimism,
      transport: http(optimism.rpcUrls.default.http[0]),
    })
    return publicClient
  },
  estimateGas: async (transaction: TransactionRequest) => {
    const publicClient = EVMServices.getClient(10)

    const account = transaction.from
    delete transaction.from

    const gas = await publicClient.estimateGas({
      account,
      ...transaction,
    })
    return gas

  },
  tracking: async (hash: Hex, chainId: ChainId) => {
    const publicClient = EVMServices.getClient(Number(chainId))
    while (true) {
      try {
        const receipt = await publicClient.getTransactionReceipt({
          hash
        })
        if (receipt) {
          return receipt
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for 1 second before checking again
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for 1 second before checking again

      }
    }


  }
}

export default EVMServices