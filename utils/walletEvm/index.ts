import { Address, createWalletClient, custom, Hash, Hex, hexToBigInt, isAddress, isHex, publicActions, stringToHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { store } from '@/redux/store'
import EVMServices from '@/services/EVM'
import { Params } from '@/types/walletConnect'
import { RawTransactionEVM } from '@/types/web3'

import { TYPE_TRANSACTION } from '@/constants/walletConnect'
import { setChainSelected } from '@/redux/slices/chainSelected'
import { addNetwork } from '@/redux/slices/chainSlice'
import { decodeData } from '../crypto'
import { lowercase, sleep } from '../functions'

class WalletEvmUtil {
  static getChainIdFromChainRequest(eip: string) {
    const chainId = eip.replace('eip155:', '')
    return Number(chainId)
  }
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

  static async approveRequest(params: Params) {
    try {
      const chainSelected = store.getState().chainSelected
      let result: any = { code: -32601, message: 'Method not found' }
      let msgParams: any = params.request.params[0]
      let address = params.request.params[1]
      const chainId = this.getChainIdFromChainRequest(params.chainId || chainSelected.toString())
      console.log({ params });

      if (!isAddress(address)) {
        address = params.request.params[0]
        msgParams = params.request.params[1]
      }
      if (!isAddress(address)) {
        address = params.request.params[0]?.from
        msgParams = params.request.params[0]
      }

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
          if (typeData.primaryType) {
            raw.primaryType = typeData.primaryType
          }

          result = await WalletEvmUtil.signTypedData(raw, wallet?.privateKey)
          break
        case 'eth_signTransaction':
          result = await WalletEvmUtil.signTransaction(
            {
              ...msgParams,
              chainId,
            },
            wallet?.privateKey
          )
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
          // EIP-3326: Switch Ethereum Chain
          // params: [{ chainId: '0x1' }]
          const switchChainId = msgParams?.chainId
          if (switchChainId) {
            const targetChainId = typeof switchChainId === 'string' && switchChainId.startsWith('0x')
              ? parseInt(switchChainId, 16)
              : switchChainId

            const chains = store.getState().chains
            const chainExists = chains.find((c) => c.id.toString() === targetChainId.toString())

            if (chainExists) {
              // Import the action dynamically to avoid circular dependencies
              store.dispatch(setChainSelected(targetChainId))
              result = null // Success returns null
            } else {
              // Chain not found - return error code 4902
              result = { code: 4902, message: 'Unrecognized chain ID. Try adding the chain using wallet_addEthereumChain first.' }
            }
          }
          break

        case 'wallet_addEthereumChain':
          // EIP-3085: Add Ethereum Chain
          // params: [{ chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls?, iconUrls? }]
          const chainParams = msgParams
          if (chainParams?.chainId) {
            const newChainId = typeof chainParams.chainId === 'string' && chainParams.chainId.startsWith('0x')
              ? parseInt(chainParams.chainId, 16)
              : chainParams.chainId

            const chains = store.getState().chains
            const existingChain = chains.find((c) => c.id.toString() === newChainId.toString())

            if (existingChain) {
              // Chain already exists, just switch to it
              store.dispatch(setChainSelected(newChainId))
              result = null
            } else {
              // Add new chain
              const newNetwork = {
                id: newChainId,
                name: chainParams.chainName || `Chain ${newChainId}`,
                nativeCurrency: chainParams.nativeCurrency || {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: {
                  default: {
                    http: Array.isArray(chainParams.rpcUrls) ? chainParams.rpcUrls : [chainParams.rpcUrls?.[0] || ''],
                  },
                  public: {
                    http: Array.isArray(chainParams.rpcUrls) ? chainParams.rpcUrls : [chainParams.rpcUrls?.[0] || ''],
                  },
                },
                blockExplorers: chainParams.blockExplorerUrls ? {
                  default: {
                    name: 'Explorer',
                    url: chainParams.blockExplorerUrls[0],
                  },
                } : undefined,
                iconChain: chainParams.iconUrls?.[0] || '',
                isCustom: true,
              }

              store.dispatch(addNetwork(newNetwork))
              await sleep(500)
              store.dispatch(setChainSelected(newChainId))
              result = null
            }
          }
          break

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
