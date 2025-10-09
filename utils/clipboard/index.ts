import * as ExpoClipboard from 'expo-clipboard'

export const Clipboard = {
  setStringAsync: async (text: string) => {
    try {
      await ExpoClipboard.setStringAsync(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  },

  getStringAsync: async () => {
    try {
      return await ExpoClipboard.getStringAsync()
    } catch (error) {
      console.error('Failed to get from clipboard:', error)
      return ''
    }
  },
}
