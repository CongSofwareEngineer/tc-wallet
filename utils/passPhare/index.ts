import { utils as baseUtils } from '@scure/base'
import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import * as ExpoCrypto from 'expo-crypto'
import { Hex, sha256, toHex } from 'viem'
import { english } from 'viem/accounts'

import { KEY_STORAGE } from '@/constants/storage'
import { ListMnemonic } from '@/types/wallet'

import { getSecureData, saveSecureData } from '../secureStorage'

type DerivedAccount = {
  privateKey: Hex
  mnemonic: string
}

class PassPhase {
  static deriveAccountFromMnemonic(mnemonic: string, accountIndex: number = 0): DerivedAccount {
    const seed = mnemonicToSeedSync(mnemonic)

    const hdKeyString = HDKey.fromMasterSeed(seed)

    const hdKey = hdKeyString.derive(`m/44'/60'/0/0/${accountIndex}`)

    const privateKey = toHex(hdKey.privateKey!)

    return { privateKey, mnemonic }
  }

  static generateMnemonic(amount = 12): string {
    const calcChecksum = (entropy: Uint8Array) => {
      const bitsLeft = 8 - entropy.length / 4
      return new Uint8Array([((sha256(entropy)[0]! as any) >> bitsLeft) << bitsLeft])
    }
    const getCoder = (wordlist: string[] = []) => {
      if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== 'string')
        throw new Error('Wordlist: expected array of 2048 strings')
      wordlist.forEach((i) => {
        if (typeof i !== 'string') throw new Error('wordlist: non-string element: ' + i)
      })
      return baseUtils.chain(baseUtils.checksum(1, calcChecksum), baseUtils.radix2(11, true), baseUtils.alphabet(wordlist))
    }

    const a = ExpoCrypto.getRandomBytes(128 / 8)
    const words = getCoder(english).encode(a)

    return words.join(' ')
  }

  static async getMnemonic(indexMnemonic = 0, isSaveLocal = true): Promise<string> {
    const arrMnemonic: ListMnemonic = (await getSecureData(KEY_STORAGE.Mnemonic)) || []


    if (!arrMnemonic[indexMnemonic]) {
      arrMnemonic[indexMnemonic] = PassPhase.generateMnemonic(12)
      // Newly generated mnemonic stored in secure storage if allowed

      if (isSaveLocal) {
        saveSecureData(KEY_STORAGE.Mnemonic, arrMnemonic)
      }
    }


    return arrMnemonic[indexMnemonic]
  }
}

export default PassPhase
