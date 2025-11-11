class MoralisUtils {
  static getApiKey(): string {
    const arr = process.env.EXPO_PUBLIC_MORALIS_API_KEY?.split(',') || []
    const randomIndex = Math.floor(Math.random() * arr.length)

    return arr[randomIndex] || ''
  }
}
export default MoralisUtils
