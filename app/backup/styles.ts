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
      fontWeight: '800',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      color: isDark ? '#999999' : '#666666',
      textAlign: 'center',
    },
    formSection: {
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
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
      borderColor: '#4CAF50',
    },
    inputWrapperError: {
      borderColor: '#FF6B6B',
    },
    input: {
      flex: 1,
      color: isDark ? '#FFFFFF' : '#000000',
      paddingVertical: 0,
      outline: 'none',
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    errorText: {
      fontSize: 14,
      color: '#FF6B6B',
      marginTop: 8,
    },
    strengthContainer: {
      marginTop: 8,
    },
    strengthText: {
      fontWeight: '500',
      marginBottom: 4,
    },
    strengthBarContainer: {
      flexDirection: 'row',
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? '#333333' : '#E9ECEF',
      overflow: 'hidden',
    },
    strengthBar: {
      height: '100%',
      borderRadius: 2,
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
      fontWeight: '700',
      color: isDark ? '#FFD700' : '#8B6914',
      marginBottom: 8,
    },
    warningText: {
      color: isDark ? '#FFEB3B' : '#8B6914',
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: 20,
    },
    backupButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 16,
      borderRadius: 12,
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
    backupButtonDisabled: {
      backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
      shadowOpacity: 0,
      elevation: 0,
    },
    backupButtonText: {
      fontWeight: '600',
      color: '#FFFFFF',
    },
    backupButtonTextDisabled: {
      color: isDark ? '#666666' : '#999999',
    },
    progressContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    progressText: {
      color: isDark ? '#999999' : '#666666',
      marginBottom: 8,
    },
    progressBar: {
      width: '100%',
      height: 4,
      backgroundColor: isDark ? '#333333' : '#E9ECEF',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4CAF50',
      borderRadius: 2,
    },
  })

export default () => {}
