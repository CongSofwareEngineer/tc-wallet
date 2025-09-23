const WalletSolana = {
  createWallet: async (privateKey: string) => {
    // const privateKeyFormat = privateKey.replace('0x', '')
    // const hexPrivate = Buffer.from(privateKeyFormat, 'hex').slice(0, 32)
    // const hex = Uint8Array.from(Buffer.from(hexPrivate)).slice(0, 32)
    // const KEYPAIRS = solanaWeb3.Keypair.fromSeed(hex)
    // const addressSolana = KEYPAIRS.publicKey.toString()
    // const privateKeySolana = bs58.encode(Buffer.from(KEYPAIRS.secretKey, 'hex'))
    return '0x' + 'abcd'.repeat(8) // Fake address for demonstration
  },
}

export default WalletSolana
