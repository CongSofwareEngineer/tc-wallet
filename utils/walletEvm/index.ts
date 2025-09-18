import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import Bignumber from 'bignumber.js'
import 'react-native-get-random-values'
import { Address, createWalletClient, custom, Hash, Hex, PrivateKeyAccount, toHex, TransactionRequest } from 'viem'
import { english, generateMnemonic, privateKeyToAccount } from 'viem/accounts'

import { KEY_STORAGE } from '@/constants/storage'
import EVMServices from '@/services/EVM'
import { ListMnemonic, WalletType } from '@/types/wallet'
import { RawTransactionEVM } from '@/types/web3'

import { getSecureData, saveSecureData } from '../secureStorage'

type DerivedAccount = {
  account: PrivateKeyAccount
  accountIndex: number
  privateKey: Hex
}

const WalletEvmUtil = {
  deriveAccountFromMnemonic: (mnemonic: string, accountIndex: number = 0): DerivedAccount => {
    const seed = mnemonicToSeedSync(mnemonic)

    const hdKeyString = HDKey.fromMasterSeed(seed)

    const hdKey = hdKeyString.derive(`m/44'/60'/${accountIndex}'/0/${accountIndex}`)

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

    return { indexMnemonic: 0, mnemonic, address, accountIndex, privateKey, type: 'evm' }
  },
  sendTransaction: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
    try {
      const publicClient = EVMServices.getClient(raw.chainId!)

      const tx: TransactionRequest = {
        to: raw.to,
        data: raw.data,
        from: raw.from,
        value: raw.value,
      }

      raw.callbackBefore?.()

      // 2) Nonce
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

      if (raw.gas) {
        tx.gas = raw.gas
      } else {
        const gas = await EVMServices.estimateGas({ ...tx })
        tx.gas = BigInt(Bignumber(gas.toString()).multipliedBy(1.05).decimalPlaces(0).toFixed()) // add 5% buffer
      }
      const account = privateKeyToAccount(privateKey)
      const wallet = createWalletClient({
        account,
        transport: custom(publicClient.transport),
      })

      const hash = await wallet.sendTransaction({
        chain: publicClient.chain,
        account: account.address,
        ...tx,
      })

      raw.callbackPending?.()
      if (raw.isTracking !== false) {
        await EVMServices.tracking(hash as Hash, raw.chainId!)
      }
      raw.callbackSuccess?.(hash as Hash)
      return hash
    } catch (error) {
      raw?.callbackError?.(error)

      return Promise.reject(error)
    }
  },
  signMessage: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
    try {
      const account = privateKeyToAccount(privateKey)
      const signature = await account.signMessage({ message: raw.message || ' ' })

      return signature as Hash
    } catch (error) {
      return Promise.reject(error)
    }
  },
  signTypedData: async (raw: RawTransactionEVM, privateKey: Hex): Promise<Hash> => {
    try {
      const account = privateKeyToAccount(privateKey)
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
}

export default WalletEvmUtil
