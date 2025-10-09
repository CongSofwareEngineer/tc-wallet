import { StyleSheet } from 'react-native'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    headerSection: {
      marginBottom: 40,
      alignItems: 'center',
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
    formSection: {
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#E9ECEF',
      paddingHorizontal: 16,
      height: 56,
    },
    inputWrapperFocused: {
      borderColor: '#2196F3',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
      paddingVertical: 0,
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    helpText: {
      fontSize: 12,
      color: isDark ? '#999999' : '#666666',
      marginTop: 4,
    },
    fileButton: {
      backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#E9ECEF',
      padding: 16,
    },
    fileButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileButtonText: {
      flex: 1,
      marginHorizontal: 12,
    },
    fileButtonTitle: {
      fontSize: 16,
      color: isDark ? '#999999' : '#666666',
      fontWeight: '500',
    },
    fileButtonTitleSelected: {
      color: isDark ? '#FFFFFF' : '#000000',
    },
    fileButtonSubtitle: {
      fontSize: 12,
      color: isDark ? '#666666' : '#999999',
      marginTop: 2,
    },
    warningSection: {
      backgroundColor: isDark ? '#2A1A00' : '#FFF3CD',
      borderRadius: 12,
      padding: 16,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: isDark ? '#FFB800' : '#FFEAA7',
    },
    warningTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#FFD700' : '#8B6914',
      marginBottom: 8,
    },
    warningText: {
      fontSize: 14,
      color: isDark ? '#FFEB3B' : '#8B6914',
      lineHeight: 20,
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: 20,
    },
    restoreButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#2196F3',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    restoreButtonDisabled: {
      backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
      shadowOpacity: 0,
      elevation: 0,
    },
    restoreButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    restoreButtonTextDisabled: {
      color: isDark ? '#666666' : '#999999',
    },
    progressContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    progressText: {
      fontSize: 14,
      color: isDark ? '#999999' : '#666666',
    },
  })
