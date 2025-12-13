class MoralisUtils {
  static indexKey = 0
  static getApiKey(): string {
    const arr = process.env.EXPO_PUBLIC_MORALIS_API_KEY?.split(',') || []
    const key = arr[this.indexKey] || ''
    if (this.indexKey + 1 >= arr.length) {
      this.indexKey = 0
    } else {
      this.indexKey++
    }

    return key
  }
}
export default MoralisUtils
