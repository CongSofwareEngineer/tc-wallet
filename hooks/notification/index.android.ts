import AppKit from '@/utils/walletKit/appkit'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

const registerNotifications = async () => {
  try {
    await Notifications.setNotificationChannelAsync('tc-wallet', {
      name: 'tc-wallet',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'music_noti_1.wav',
      showBadge: true,
    })

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
    console.log('Device Push Token (FCM/Native):', tokenData.data)

    const expoTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
    console.log('Expo Push Token (for Expo Tool):', expoTokenData.data)

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
