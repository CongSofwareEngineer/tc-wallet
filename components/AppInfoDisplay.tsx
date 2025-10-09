import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { APP_CONFIG, APP_INFO, SECURITY_CONFIG } from '@/constants/appConfig'
import useMode from '@/hooks/useMode'

// Component example để hiển thị app info
const AppInfoDisplay = () => {
  const { isDark } = useMode()

  return (
    <View style={{ padding: 20, backgroundColor: isDark ? '#000' : '#fff' }}>
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>App Information</ThemedText>

      <ThemedText>App Name: {APP_INFO.displayName}</ThemedText>
      <ThemedText>Version: {APP_INFO.fullVersion}</ThemedText>
      <ThemedText>Bundle ID: {APP_INFO.identifier}</ThemedText>
      <ThemedText>Slug: {APP_CONFIG.slug}</ThemedText>

      <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>Platform Info</ThemedText>
      <ThemedText>Platform: {APP_CONFIG.platform?.ios ? 'iOS' : APP_CONFIG.platform?.android ? 'Android' : 'Web'}</ThemedText>
      <ThemedText>Is Device: {APP_CONFIG.isDevice ? 'Yes' : 'No'}</ThemedText>
      <ThemedText>Device Name: {APP_CONFIG.deviceName || 'Unknown'}</ThemedText>

      <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>Environment</ThemedText>
      <ThemedText>Environment: {APP_CONFIG.isDevelopment ? 'Development' : 'Production'}</ThemedText>
      <ThemedText>EAS Project ID: {APP_CONFIG.easProjectId}</ThemedText>

      <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>Security Config</ThemedText>
      <ThemedText>Min Password Length: {SECURITY_CONFIG.minPasswordLength}</ThemedText>
      <ThemedText>Session Timeout: {SECURITY_CONFIG.sessionTimeout / 1000 / 60} minutes</ThemedText>
      <ThemedText>Default Key: {SECURITY_CONFIG.defaultKeyEncode.substring(0, 10)}...</ThemedText>
    </View>
  )
}

export default AppInfoDisplay
