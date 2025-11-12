import { width } from '@/utils/systems'
import { StyleSheet } from 'react-native'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#999999' : '#666666',
      textAlign: 'center',
      lineHeight: 24,
    },
    passwordSection: {
      alignItems: 'center',
      marginBottom: 60,
    },
    stepIndicator: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 20,
    },
    passwordContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    passwordDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginHorizontal: 8,
      borderWidth: 2,
    },
    passwordDotEmpty: {
      backgroundColor: 'transparent',
      borderColor: isDark ? '#333333' : '#E0E0E0',
    },
    passwordDotFilled: {
      backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
      borderColor: isDark ? '#4CAF50' : '#4CAF50',
    },
    passwordDotError: {
      backgroundColor: 'transparent',
      borderColor: '#FF6B6B',
    },
    errorMessage: {
      fontSize: 14,
      color: '#FF6B6B',
      textAlign: 'center',
      marginTop: 10,
    },
    successMessage: {
      fontSize: 14,
      color: '#4CAF50',
      textAlign: 'center',
      marginTop: 10,
    },
    keypad: {
      alignItems: 'center',
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    keypadButton: {
      width: width(20),
      height: width(20),
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: width(5),
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    keypadButtonLight: {
      backgroundColor: '#F8F9FA',
      borderWidth: 1,
      borderColor: '#E9ECEF',
    },
    keypadButtonDark: {
      backgroundColor: '#1A1A1A',
      borderWidth: 1,
      borderColor: '#333333',
    },
    keypadButtonPressed: {
      transform: [{ scale: 0.95 }],
    },
    keypadNumber: {
      fontSize: 24,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    keypadActionButton: {
      width: width(20),
      height: width(20),
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: width(5),
    },
    deleteButton: {
      backgroundColor: isDark ? '#FF4444' : '#FF6B6B',
    },
    deleteButtonDisabled: {
      backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0',
    },
    continueButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 25,
      marginTop: 40,
      minWidth: 200,
      alignItems: 'center',
      shadowColor: '#4CAF50',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    continueButtonDisabled: {
      backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
      shadowOpacity: 0,
      elevation: 0,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    continueButtonTextDisabled: {
      color: isDark ? '#666666' : '#999999',
    },
  })
