class EtherScanUtils {
  static getEtherScanApiKey() {
    const arr = process.env.EXPO_PUBLIC_ETHER_SCAN_API_KEY.split(',') || []
    const randomIndex = Math.floor(Math.random() * arr.length)

    return arr[randomIndex] || ''
  }

  static isProxyAbi(abi: any[]): boolean {
    if (!Array.isArray(abi)) return false

    const hasFunction = abi.some((item) => item.type === 'function')
    if (hasFunction) return false

    const hasUpgradedEvent = abi.some((item) => item.name === 'Upgraded')
    const hasConstructorWithLogic = abi.some(
      (item) => item.type === 'constructor' && item.inputs?.some((i) => i.name === '_logic' && i.type === 'address')
    )

    const hasFallback = abi.some((item) => item.type === 'fallback')
    const hasReceive = abi.some((item) => item.type === 'receive')

    return hasUpgradedEvent && hasConstructorWithLogic && (hasFallback || hasReceive)
  }
}

export default EtherScanUtils
