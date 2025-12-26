import { Address, createWalletClient, custom, Hash, Hex, hexToBigInt, isHex, publicActions, stringToHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { store } from '@/redux/store'
import EVMServices from '@/services/EVM'
import { RawTransactionEVM } from '@/types/web3'

import { TYPE_TRANSACTION } from '@/constants/walletConnect'
import { decodeData } from '../crypto'

class WalletEvmUtil {
  static createWallet(privateKey: Hex): Address {
    const account = privateKeyToAccount(privateKey)
    const address = account.address
    return address
  }

  static async sendTransaction(raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> {
    try {
      raw.callbackBefore?.()
      const chainSelected = store.getState().chainSelected
      const chainId = raw.chainId || chainSelected

      const publicClient = EVMServices.getClient(raw.chainId!)
      const privateKeyDecode = await decodeData(privateKey)

      const account = privateKeyToAccount(privateKeyDecode)
      const wallet = createWalletClient({
        account,
        transport: custom(publicClient.transport),
      }).extend(publicActions)

      const tx = await EVMServices.getRawTransactions({
        ...raw,
        from: raw.from || wallet.account.address,
        chainId,
      })
      const hash = await wallet.sendTransaction({
        chain: publicClient.chain,
        ...tx,
      })

      raw.callbackPending?.()
      if (raw.isTracking) {
        await EVMServices.tracking(hash as Hash, raw.chainId!)
      }
      raw.callbackSuccess?.(hash as Hash)
      return hash
    } catch (error) {
      raw?.callbackError?.(error)

      return Promise.reject(error)
    }
  }

  static async signTransaction(raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> {
    try {
      const publicClient = EVMServices.getClient(raw.chainId!)
      const privateKeyDecode = await decodeData(privateKey)

      const wallet = createWalletClient({
        account: privateKeyToAccount(privateKeyDecode),
        transport: custom(publicClient.transport),
      })

      const tx = await EVMServices.getRawTransactions({
        to: raw.to,
        from: raw.from || wallet.account.address,
        chainId: raw.chainId,
      })

      if (raw.gas) {
        tx.gas = raw.gas
        if (isHex(raw.gas)) {
          tx.gas = hexToBigInt(raw.gas)
        }
      }

      if (raw.nonce) {
        tx.nonce = raw.nonce
        if (isHex(raw.nonce)) {
          tx.nonce = Number(hexToBigInt(raw.nonce).toString())
        }
      }

      if (raw.value) {
        tx.value = raw.value
        if (isHex(raw.value)) {
          tx.value = hexToBigInt(raw.value)
        }
      }

      if (raw.data) {
        tx.data = raw.data
      }

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

      if (raw.maxFeePerBlobGas) {
        tx.maxFeePerBlobGas = raw.maxFeePerBlobGas
        if (isHex(raw.maxFeePerBlobGas)) {
          tx.maxFeePerBlobGas = hexToBigInt(raw.maxFeePerBlobGas)
        }
      }

      if (raw.type) {
        tx.type = TYPE_TRANSACTION[raw.type]
      }

      if (raw.authorizationList) {
        tx.authorizationList = raw.authorizationList
      }
      if (raw.gasPrice) {
        tx.gasPrice = raw.gasPrice
        if (isHex(raw.gasPrice)) {
          tx.gasPrice = hexToBigInt(raw.gasPrice)
        }
      }

      const signature = await wallet.signTransaction({
        chain: publicClient.chain,
        ...tx,
      })

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async signMessage(raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> {
    try {
      const privateKeyDecode = await decodeData(privateKey)

      const account = privateKeyToAccount(privateKeyDecode)
      let signature = ''
      if (isHex(raw.message)) {
        signature = await account.signMessage({
          message: {
            raw: raw.message || ' ',
          },
        })
      } else {
        signature = await account.signMessage({
          message: {
            raw: stringToHex(raw.message as string),
          },
        })
      }

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async signTypedData(raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> {
    try {
      const privateKeyDecode = await decodeData(privateKey)

      const account = privateKeyToAccount(privateKeyDecode)
      const rawSign: any = {
        domain: raw.domain,
        types: raw.types,
        message: raw.message!,
      }
      if (raw.primaryType) {
        rawSign.primaryType = raw.primaryType
      }

      const signature = await account.signTypedData(rawSign as any)

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default WalletEvmUtil
