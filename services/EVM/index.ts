import { Address, TransactionRequest } from 'viem'

import { store } from '@/redux/store'
import { RawTransactionEVM } from '@/types/web3'

import Web3Service from '../web3'

class EVMServices extends Web3Service {
  static async estimateGas(transaction: RawTransactionEVM) {
    const publicClient = this.getClient(transaction.chainId!)

    const account = transaction.from

    const gas = await publicClient.estimateGas({
      account,
      ...transaction,
    })

    return gas
  }

  static async getRawTransactions(raw: RawTransactionEVM): Promise<RawTransactionEVM> {
    const publicClient = this.getClient(raw.chainId!)
    const chainId = raw.chainId!
    const tx: TransactionRequest = {
      to: raw.to,
      data: raw.data || '0x',
      value: raw.value,
    }

    if (raw.from) {
      const nonce = await publicClient.getTransactionCount({ address: raw.from as Address, blockTag: 'latest' })
      tx.nonce = nonce
      tx.from = raw.from
    } else {
      const walletActive = store.getState().wallet.wallet

      const nonce = await publicClient.getTransactionCount({ address: walletActive!.address as Address, blockTag: 'latest' })
      tx.nonce = nonce
      tx.from = walletActive!.address as Address
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
        const gasPrice = await this.getGasPrice(chainId, raw?.multiplier)

        tx.gasPrice = gasPrice
      }
    }

    return tx
  }
}

export default EVMServices
