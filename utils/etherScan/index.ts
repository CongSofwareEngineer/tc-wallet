class EtherScanUtils {
  static indexApi = 0
  static getEtherScanApiKey() {
    const arr = process.env.EXPO_PUBLIC_ETHER_SCAN_API_KEY.split(',') || []
    this.indexApi = this.indexApi >= arr.length ? 0 : this.indexApi + 1
    return arr[this.indexApi] || ''
  }
}

export default EtherScanUtils
