import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import Bignumber from 'bignumber.js'
import 'react-native-get-random-values'
import { Address, createWalletClient, custom, Hash, Hex, isAddress, PrivateKeyAccount, toHex } from 'viem'
import { english, generateMnemonic, privateKeyToAccount } from 'viem/accounts'

import { KEY_STORAGE } from '@/constants/storage'
import EVMServices from '@/services/EVM'
import { ListMnemonic, WalletType } from '@/types/wallet'
import { Params } from '@/types/walletConnect'
import { RawTransactionEVM } from '@/types/web3'
import { walletsZustand } from '@/zustand/wallet'

import { decodeData, encodeData } from '../crypto'
import { lowercase } from '../functions'
import { getSecureData, saveSecureData } from '../secureStorage'
import WalletKit from '../walletKit'

type DerivedAccount = {
  account: PrivateKeyAccount
  accountIndex: number
  privateKey: Hex
}

const WalletEvmUtil = {
  deriveAccountFromMnemonic: (mnemonic: string, accountIndex: number = 0): DerivedAccount => {
    const seed = mnemonicToSeedSync(mnemonic)

    const hdKeyString = HDKey.fromMasterSeed(seed)

    const hdKey = hdKeyString.derive(`m/44'/60'/0/0/${accountIndex}`)

    const privateKey = toHex(hdKey.privateKey!)

    const account = privateKeyToAccount(privateKey)

    return { account, accountIndex, privateKey }
  },
  getMnemonic: async (indexMnemonic = 0): Promise<string> => {
    const arrMnemonic: ListMnemonic = (await getSecureData(KEY_STORAGE.Mnemonic)) || []

    if (!arrMnemonic[indexMnemonic]) {
      arrMnemonic[indexMnemonic] = generateMnemonic(english, 128)
      saveSecureData(KEY_STORAGE.Mnemonic, arrMnemonic)
    }

    return arrMnemonic[indexMnemonic]
  },

  createWallet: async (
    accountIndex: number = 0,
    indexMnemonic = 0
  ): Promise<{
    mnemonic: string
    address: Address
    accountIndex: number
    privateKey: Hex
    type: WalletType
    indexMnemonic: number
  }> => {
    const mnemonic = await WalletEvmUtil.getMnemonic(indexMnemonic)

    const { account, privateKey } = WalletEvmUtil.deriveAccountFromMnemonic(mnemonic, accountIndex)

    const address = account.address
    const privateKeyEncode = (await encodeData(privateKey)) as Hex

    return { indexMnemonic: 0, mnemonic, address, accountIndex, privateKey: privateKeyEncode, type: 'evm' }
  },
  sendTransaction: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
    try {
      raw.callbackBefore?.()

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

      const hash = await wallet.sendTransaction({
        chain: publicClient.chain,
        account: wallet.account.address,
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
  },
  signTransaction: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
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
  },
  signMessage: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
    try {
      const privateKeyDecode = await decodeData(privateKey)

      const account = privateKeyToAccount(privateKeyDecode)
      const signature = await account.signMessage({ message: raw.message || ' ' })

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  },
  signTypedData: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
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
  },
  approveRequest: async (id: number, topic: string, params: Params) => {
    const walletKit = await WalletKit.init()
    try {
      let result: any = { code: -32601, message: 'Method not found' }
      let msgParams: any = params.request.params[0]
      let address = params.request.params[1]

      if (!isAddress(address)) {
        address = params.request.params[0]
        msgParams = params.request.params[1]
      }
      const wallet = walletsZustand.getState().wallets.find((w) => lowercase(w.address) === lowercase(address))!
      console.log({ msgParams, address, wallet })

      switch (params.request.method) {
        case 'eth_accounts':
          result = ['0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb']
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
          console.log({ raw })

          result = await WalletEvmUtil.signTypedData(raw, wallet?.privateKey)
          break
        case 'eth_signTransaction':
          result = '0x' + 'abcd'.repeat(16) // Fake tx hash for demonstration
          break
        case 'eth_sendTransaction':
          result = '0x' + 'abcd'.repeat(16) // Fake tx hash for demonstration

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

      console.log({ result })

      // await walletKit.respondSessionRequest({
      //   topic: topic,
      //   response: {
      //     id: id,
      //     jsonrpc: '2.0',
      //     result: result,
      //   },
      // })
    } catch (error) {
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
  },
}

export default WalletEvmUtil
