// Ensure crypto.getRandomValues is available in React Native.
import 'react-native-get-random-values'
import { Hex } from 'viem'
import { english, generateMnemonic, mnemonicToAccount, type HDAccount } from 'viem/accounts'

type DerivedAccount = {
  account: HDAccount
  path: string
  accountIndex: number
}

const Web3Utils = {
  generateMnemonic12: (): string => generateMnemonic(english, 128),
  deriveAccountFromMnemonic: (mnemonic: string, accountIndex: number = 0): DerivedAccount => {
    const path: `m/44'/60'/${string}` = `m/44'/60'/${accountIndex}'/0/0`
    const account = mnemonicToAccount(mnemonic, { path })

    return { account, path, accountIndex }
  },

  createWallet: (
    accountIndex: number = 0
  ): {
    mnemonic: string
    account: HDAccount
    path: string
    accountIndex: number
    privateKey: Hex
  } => {
    const mnemonic = generateMnemonic(english, 128)
    const { account, path } = Web3Utils.deriveAccountFromMnemonic(mnemonic, accountIndex)
    const privateKey = `0x${account.getHdKey().privateExtendedKey}` as Hex

    return { mnemonic, account, path, accountIndex, privateKey }
  },
}

export default Web3Utils
