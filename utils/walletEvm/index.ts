import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import Bignumber from 'bignumber.js'
import 'react-native-get-random-values'
import { Address, createWalletClient, custom, Hash, Hex, PrivateKeyAccount, toHex } from 'viem'
import { english, generateMnemonic, privateKeyToAccount } from 'viem/accounts'

import { KEY_STORAGE } from '@/constants/storage'
import EVMServices from '@/services/EVM'
import { ListMnemonic, WalletType } from '@/types/wallet'
import { RawTransactionEVM } from '@/types/web3'

import { decodeData, encodeData } from '../crypto'
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
}

export default WalletEvmUtil
