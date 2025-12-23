import AppKit from '@/utils/walletKit/appkit'

const registerNotifications = async () => {
  try {
    console.log('registerNotifications web - starting')

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return
    }

    // Check current permission status
    let permission = Notification.permission

    // Request permission if not granted
    if (permission === 'default') {
      permission = await Notification.requestPermission()
      console.log('Notification permission requested:', permission)
    }

    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return
    }

    console.log('Notification permission granted')

    // For web push notifications, you need to:
    // 1. Register a service worker
    // 2. Subscribe to push notifications
    // 3. Send the subscription to your backend

    // Check if service worker is supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)

        // Subscribe to push notifications
        // Note: You need a VAPID public key from your push service
        // const subscription = await registration.pushManager.subscribe({
        //   userVisibleOnly: true,
        //   applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
        // })

        // For now, we'll just generate a unique token for this device
        const deviceToken = generateWebDeviceToken()

        const appKitInstance = AppKit.getInstance()
        if (appKitInstance) {
          const clientId = await appKitInstance.core.crypto.getClientId()
          await AppKit.registerDeviceToken(deviceToken, clientId)
          console.log('Web notification token registered successfully:', deviceToken)
        }
      } catch (swError) {
        console.error('Service Worker registration failed:', swError)
        // Fallback: still register a device token even without service worker
        const deviceToken = generateWebDeviceToken()
        const appKitInstance = AppKit.getInstance()
        if (appKitInstance) {
          const clientId = await appKitInstance.core.crypto.getClientId()
          await AppKit.registerDeviceToken(deviceToken, clientId)
          console.log('Web device token registered (no SW):', deviceToken)
        }
      }
    } else {
      console.warn('Push notifications not supported in this browser')
      // Still register a basic device token
      const deviceToken = generateWebDeviceToken()
      const appKitInstance = AppKit.getInstance()
      if (appKitInstance) {
        const clientId = await appKitInstance.core.crypto.getClientId()
        await AppKit.registerDeviceToken(deviceToken, clientId)
        console.log('Basic web device token registered:', deviceToken)
      }
    }
  } catch (error) {
    console.error('Failed to register web notifications:', error)
  }
}

// Generate a unique device token for web
function generateWebDeviceToken(): string {
  // Use a combination of user agent, timestamp, and random value
  const userAgent = navigator.userAgent
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)

  // Create a simple hash
  const token = `web_${btoa(`${userAgent}_${timestamp}_${random}`).substring(0, 64)}`

  // Store in localStorage to persist across sessions
  const storedToken = localStorage.getItem('web_push_token')
  if (storedToken) {
    return storedToken
  }

  localStorage.setItem('web_push_token', token)
  return token
}

export default registerNotifications
