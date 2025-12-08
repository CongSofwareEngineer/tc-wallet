import { Address, hexToBigInt, isHex, TransactionRequest } from 'viem'

import { store } from '@/redux/store'
import { ChainId, RawTransactionEVM } from '@/types/web3'

import { TYPE_TRANSACTION } from '@/constants/walletConncet'
import { isChainIdDefault } from '@/utils/nvm'
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

  static async checkIsContract(chainId: ChainId, address: Address) {
    try {
      const provider = this.getClient(chainId)
      const code = (await provider.getCode({
        address: address as any,
      })) as string

      const isSmart7702 = code.startsWith('0xef010')

      if (isSmart7702) {
        return false
      }

      const arrCall: any[] = []

      const arrInterfaceNFT = ['0x01ffc9a7', '0xd9b67a26', '0x0e89341c']

      // get interface to check is contract (NFT,...)
      arrInterfaceNFT.forEach((item) => {
        arrCall.push({
          address: address as any,
          abi: [
            {
              inputs: [
                {
                  internalType: 'bytes4',
                  name: 'interfaceId',
                  type: 'bytes4',
                },
              ],
              name: 'supportsInterface',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'supportsInterface',
          args: [item],
        })
      })

      // check entryPoint to check is SmartWallet
      arrCall.push({
        address: address as any,
        abi: [
          {
            inputs: [],
            name: 'entryPoint',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'entryPoint',
      })

      const isChainDefault = isChainIdDefault(chainId)
      if (isChainDefault) {
        let resultsCall = await provider.multicall({ contracts: arrCall, blockTag: 'latest' })

        const results = resultsCall.map((e) => e.result)

        // is contract (NFT,...)
        if (results[0] || results[1] || results[2]) {
          return true
        }

        // is SmartWallet
        if (results[3]) {
          return false
        }

        return code !== '0x'
      } else {
        const resultsCall = await Promise.allSettled(arrCall.map((item, index) => provider.readContract({
          address: item.address,
          abi: item.abi,
          functionName: item.functionName,
          args: item.args,
          blockTag: 'latest',
        })))

        const results = resultsCall.filter((e) => {
          if (e.status === 'fulfilled') {
            return true
          }
          return false
        }).map((e: any) => e.value)

        // is contract (NFT,...)
        if (results[0] || results[1] || results[2]) {
          return true
        }

        // is SmartWallet
        if (results[3]) {
          return false
        }

        return code !== '0x'
      }


    } catch (error) {
      console.log({ errorcheckIsContract: error })

      return false
    }
  }

}

export default EVMServices
