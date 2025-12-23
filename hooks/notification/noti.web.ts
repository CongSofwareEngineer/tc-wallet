import AppKit from '@/utils/walletKit/appkit'
import * as Notifications from 'expo-notifications'

const registerNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }

    const tokenData = await Notifications.getDevicePushTokenAsync()
    const token = tokenData.data
    const appKitInstance = AppKit.getInstance()

    if (appKitInstance) {
      const clientId = await appKitInstance.core.crypto.getClientId()
      await AppKit.registerDeviceToken(token, clientId)
      console.log('Notification token registered successfully:', token)
    }
  } catch (error) {
    console.error('Failed to register notifications:', error)
  }
}

export default registerNotifications
