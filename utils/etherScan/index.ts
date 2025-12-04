class EtherScanUtils {
  static getEtherScanApiKey() {
    const arr = process.env.EXPO_PUBLIC_ETHER_SCAN_API_KEY.split(',') || []
    const randomIndex = Math.floor(Math.random() * arr.length)

    return arr[randomIndex] || ''
  }
}

export default EtherScanUtils
