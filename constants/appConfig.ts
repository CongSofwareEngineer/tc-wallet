import Constants from 'expo-constants'

// App Configuration từ expo-constants
export const APP_CONFIG = {
  // App Info từ expo manifest
  appName: Constants.expoConfig?.extra?.appConfig?.appName || Constants.expoConfig?.name || 'TC Wallet',
  appVersion: Constants.expoConfig?.extra?.appConfig?.appVersion || Constants.expoConfig?.version || '1.0.0',
  slug: Constants.expoConfig?.slug || 'tc-wallet',

  // Key Encode Default
  keyEncodeDefault: Constants.expoConfig?.extra?.appConfig?.keyEncodeDefault || 'tc-wallet-secure-key-2024',

  // Platform Info
  platform: Constants.platform,
  isDevice: Constants.isDevice,
  deviceName: Constants.deviceName,

  // Build Info
  buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1',
  bundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package || 'com.diencong.tcwallet',

  // Environment
  isDevelopment: __DEV__,
  isProduction: !__DEV__,

  // EAS Info
  easProjectId: Constants.expoConfig?.extra?.eas?.projectId || '',

  // API Keys
  apiKeyAlchemy: Constants.expoConfig?.extra?.apiKey?.API_KEY_ALCHEMY || '',
}

// App Display Info
export const APP_INFO = {
  displayName: APP_CONFIG.appName,
  version: APP_CONFIG.appVersion,
  fullVersion: `${APP_CONFIG.appVersion} (${APP_CONFIG.buildNumber})`,
  identifier: APP_CONFIG.bundleIdentifier,
}

// Security Config
export const SECURITY_CONFIG = {
  defaultKeyEncode: APP_CONFIG.keyEncodeDefault,
  // Có thể thêm các config bảo mật khác
  minPasswordLength: 8,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
}

// Export default
export default {
  APP_CONFIG,
  APP_INFO,
  SECURITY_CONFIG,
}
