import { Address, hexToBigInt, isHex, TransactionRequest } from 'viem'

import { store } from '@/redux/store'
import { RawTransactionEVM } from '@/types/web3'

import { TYPE_TRANSACTION } from '@/constants/walletConncet'
import BigNumber from 'bignumber.js'
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
      value: raw.value || 0n,
    }

    if (tx.value && isHex(tx.value)) {
      tx.value = hexToBigInt(tx.value)
    }
    if (tx.nonce) {
      if (isHex(tx.nonce)) {
        tx.nonce = BigNumber(hexToBigInt(tx.nonce).toString()).toNumber()
      }
    } else {
      const nonce = await publicClient.getTransactionCount({ address: raw.from as Address, blockTag: 'latest' })
      tx.nonce = nonce
    }

    if (raw.from) {
      tx.from = raw.from
    } else {
      const walletActive = store.getState().wallet.wallet
      tx.from = walletActive!.address as Address
    }

    // 3) Gas price / fees
    if (raw.gasPrice) {
      tx.gasPrice = raw.gasPrice
      if (isHex(raw.gasPrice)) {
        tx.gasPrice = hexToBigInt(raw.gasPrice)
      }
    } else {
      if (raw.maxFeePerGas || raw.maxPriorityFeePerGas) {
        if (raw.maxFeePerGas) {
          tx.maxFeePerGas = raw.maxFeePerGas
          if (isHex(raw.maxFeePerGas)) {
            tx.maxFeePerGas = hexToBigInt(raw.maxFeePerGas)
          }
        }
        if (raw.maxPriorityFeePerGas) {
          tx.maxPriorityFeePerGas = raw.maxPriorityFeePerGas
          if (isHex(raw.maxPriorityFeePerGas)) {
            tx.maxPriorityFeePerGas = hexToBigInt(raw.maxPriorityFeePerGas)
          }
        }
      }
    }
    if (raw.type) {
      tx.type = TYPE_TRANSACTION[raw.type]
    }

    if (raw.gas) {
      tx.gas = raw.gas
      if (isHex(raw.gas)) {
        tx.gas = hexToBigInt(raw.gas)
      }
    }


    return tx
  }
}

export default EVMServices
