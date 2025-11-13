import Bignumber from 'bignumber.js'
import { Address, createWalletClient, custom, Hash, Hex, hexToBigInt, isAddress, isHex, publicActions, stringToHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { store } from '@/redux/store'
import EVMServices from '@/services/EVM'
import { Params } from '@/types/walletConnect'
import { RawTransactionEVM } from '@/types/web3'

import { decodeData } from '../crypto'
import { lowercase } from '../functions'

class WalletEvmUtil {
  static getChainIdFromChainRequest(eip: string) {
    const chainId = eip.replace('eip155:', '')
    return Number(chainId)
  }
  static async createWallet(privateKey: Hex): Promise<Address> {
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
      console.log({ getRawTransactions: tx })

      if (raw.gas) {
        tx.gas = raw.gas
        if (isHex(raw.gas)) {
          tx.gas = hexToBigInt(raw.gas)
        }
      } else {
        const gas = await EVMServices.estimateGas({ ...tx, chainId })

        tx.gas = BigInt(Bignumber(gas.toString()).multipliedBy(1.05).decimalPlaces(0).toFixed()) // add 5% buffer
      }

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
        data: raw.data,
        value: raw.value,
        from: raw.from || wallet.account.address,
        chainId: raw.chainId,
      })

      if (raw.gas) {
        tx.gas = raw.gas
      } else {
        const gas = await EVMServices.estimateGas({ ...tx })
        tx.gas = BigInt(Bignumber(gas.toString()).multipliedBy(1.05).decimalPlaces(0).toFixed()) // add 5% buffer
      }

      const signature = await wallet.signTransaction({
        chain: publicClient.chain,
        account: wallet.account.address,
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
      const signature = await account.signTypedData({
        domain: raw.domain,
        types: raw.types,
        primaryType: raw.primaryType!,
        message: raw.message!,
      })

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async approveRequest(id: number, topic: string, params: Params) {
    try {
      const chainSelected = store.getState().chainSelected
      let result: any = { code: -32601, message: 'Method not found' }
      let msgParams: any = params.request.params[0]
      let address = params.request.params[1]
      const chainId = this.getChainIdFromChainRequest(params.chainId || chainSelected.toString())

      if (!isAddress(address)) {
        address = params.request.params[0]
        msgParams = params.request.params[1]
      }
      if (!isAddress(address)) {
        address = params.request.params[0]?.from
        msgParams = params.request.params[0]
      }
      console.log({
        raw: {
          ...msgParams,
          chainId,
        },
      })

      const wallet = store.getState().wallet.wallets.find((w) => lowercase(w.address) === lowercase(address))!

      switch (params.request.method) {
        case 'eth_accounts':
          result = [wallet.address]
          break
        case 'eth_sign':
          result = '0x' + 'abcd'.repeat(32) // Fake signature for demonstration
          break
        case 'eth_signTypedData':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData_v3':
          const typeData = JSON.parse(msgParams)
          const raw: RawTransactionEVM = {
            domain: typeData.domain,
            types: typeData.types,
            message: typeData.message,
          }

          // Remove EIP712Domain from types to avoid issues with some libraries
          if (raw.types.EIP712Domain) {
            delete raw.types.EIP712Domain
          }
          if (typeData.primaryType) {
            raw.primaryType = typeData.primaryType
          }

          result = await WalletEvmUtil.signTypedData(raw, wallet?.privateKey)
          break
        case 'eth_signTransaction':
          msgParams.chainId = chainId
          result = await WalletEvmUtil.signTransaction(msgParams, wallet?.privateKey)
          // result = '0x' + 'abcd'.repeat(16) // Fake tx hash for demonstration
          break
        case 'eth_sendTransaction':
          result = await WalletEvmUtil.sendTransaction(
            {
              ...msgParams,
              chainId,
            },
            wallet?.privateKey
          )

          break
        case 'personal_sign':
          const msg = await WalletEvmUtil.signMessage(
            {
              message: msgParams,
            },
            wallet?.privateKey
          )
          result = msg

          break

        case 'wallet_switchEthereumChain':
        case 'wallet_addEthereumChain':
        case 'wallet_getPermissions':
        case 'wallet_requestPermissions':
        case 'wallet_registerOnboarding':
        case 'wallet_watchAsset':
        case 'wallet_scanQRCode':
        case 'wallet_sendCalls':
        case 'wallet_getCallsStatus':
        case 'wallet_showCallsStatus':
        case 'wallet_getCapabilities':
          break
      }

      return result
    } catch (error) {
      return Promise.reject(error)
      // console.error('onApproveRequest error', error)
      // await walletKit.respondSessionRequest({
      //   topic: topic,
      //   response: {
      //     id: id,
      //     jsonrpc: '2.0',
      //     error: { code: -32000, message: (error as Error).message },
      //   },
      // })
    }
  }
}

export default WalletEvmUtil
