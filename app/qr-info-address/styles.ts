import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: 'auto',
      // backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    chainInfo: {
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
    },
    chainText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#8E8E93' : '#6D6D70',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
      borderRadius: 12,
      padding: 4,
      marginVertical: 20,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: isDark ? '#007AFF' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#8E8E93' : '#6D6D70',
    },
    tabTextActive: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrSection: {
      alignItems: 'center',
      // paddingVertical: 40,
    },
    qrContainer: {
      padding: 20,
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 20,
      marginBottom: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    addressLabel: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 10,
    },
    fullAddress: {
      fontSize: 14,
      color: isDark ? '#8E8E93' : '#6D6D70',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    copyButtonText: {
      fontSize: 14,
      color: COLORS.green600,
      marginLeft: 6,
      fontWeight: '500',
    },
    scanSection: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    scanTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 10,
      textAlign: 'center',
    },
    scanSubtitle: {
      fontSize: 16,
      color: isDark ? '#8E8E93' : '#6D6D70',
      textAlign: 'center',
      marginBottom: 40,
      paddingHorizontal: 20,
    },
    openCameraButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#38383A' : '#E5E5EA',
    },
    openCameraText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 8,
    },
    bottomSection: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    requestButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#007AFF',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    requestButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  })
