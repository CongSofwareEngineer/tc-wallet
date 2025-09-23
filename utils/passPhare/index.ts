import { HDKey } from '@scure/bip32'
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39'
import { Hex, toHex } from 'viem'
import { english } from 'viem/accounts'

import { KEY_STORAGE } from '@/constants/storage'
import { ListMnemonic } from '@/types/wallet'

import { getSecureData, saveSecureData } from '../secureStorage'
type DerivedAccount = {
  privateKey: Hex
  mnemonic: string
}

const PassPhare = {
  deriveAccountFromMnemonic: (mnemonic: string, accountIndex: number = 0): DerivedAccount => {
    const seed = mnemonicToSeedSync(mnemonic)

    const hdKeyString = HDKey.fromMasterSeed(seed)

    const hdKey = hdKeyString.derive(`m/44'/60'/0/0/${accountIndex}`)

    const privateKey = toHex(hdKey.privateKey!)

    return { privateKey, mnemonic }
  },
  getMnemonic: async (indexMnemonic = 0): Promise<string> => {
    const arrMnemonic: ListMnemonic = (await getSecureData(KEY_STORAGE.Mnemonic)) || []

    if (!arrMnemonic[indexMnemonic]) {
      arrMnemonic[indexMnemonic] = generateMnemonic(english, 128)
      saveSecureData(KEY_STORAGE.Mnemonic, arrMnemonic)
    }

    return arrMnemonic[indexMnemonic]
  },
}

export default PassPhare
