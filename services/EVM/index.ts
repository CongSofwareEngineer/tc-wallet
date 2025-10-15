import { Address, createPublicClient, Hex, http, TransactionRequest } from 'viem'

import { store } from '@/redux/store'
import { ChainId, RawTransactionEVM } from '@/types/web3'

class EVMServices {
  static getClient(chainId: ChainId) {
    const listChain = store.getState().chains

    const chain = listChain.find((item) => item.id.toFixed() === chainId.toString())

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(chain!.rpcUrls.default.http[0]),
    })

    return publicClient
  }

  static async estimateGas(transaction: RawTransactionEVM) {
    const publicClient = this.getClient(transaction.chainId!)

    const account = transaction.from

    delete transaction.from

    const gas = await publicClient.estimateGas({
      account,
      ...transaction,
    })

    return gas
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

  static async getRawTransactions(raw: RawTransactionEVM): Promise<RawTransactionEVM> {
    const publicClient = this.getClient(raw.chainId!)
    const tx: TransactionRequest = {
      to: raw.to,
      data: raw.data,
      value: raw.value,
      from: raw.from,
    }

    if (raw.nonce !== undefined) {
      tx.nonce = raw.nonce
    } else if (tx.from) {
      const nonce = await publicClient.getTransactionCount({ address: tx.from as Address, blockTag: 'latest' })

      tx.nonce = nonce
    }

    // 3) Gas price / fees
    if (raw.gasPrice) {
      tx.gasPrice = raw.gasPrice
    } else {
      if (raw.maxFeePerGas || raw.maxPriorityFeePerGas) {
        if (raw.maxFeePerGas) {
          tx.maxFeePerGas = raw.maxFeePerGas
        }
        if (raw.maxPriorityFeePerGas) {
          tx.maxPriorityFeePerGas = raw.maxPriorityFeePerGas
        }
      } else {
        const gasPrice = await publicClient.getGasPrice()
        tx.gasPrice = gasPrice
      }
    }

    return tx
  }
}

export default EVMServices
