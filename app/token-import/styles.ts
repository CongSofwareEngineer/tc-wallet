import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'

export const getStyles = (isDark: boolean) => {
  const backgroundColor = isDark ? COLORS.black1 : '#fff'
  const inputBackground = isDark ? COLORS.black2 : '#f5f5f5'
  const textColor = isDark ? '#fff' : '#000'
  const borderColor = isDark ? COLORS.black2 : '#e0e0e0'
  const placeholderColor = isDark ? '#666' : '#999'

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      marginBottom: 8,
      color: textColor,
      fontWeight: '500',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: inputBackground,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: textColor,
      paddingHorizontal: 12,
    },
    pasteButton: {
      padding: 8,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconPreview: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: inputBackground,
      borderWidth: 1,
      borderColor,
    },
    bottomContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: borderColor,
      backgroundColor,
    },
    importButton: {
      backgroundColor: '#007AFF',
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    importButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    inputError: {
      borderColor: '#ff4d4d',
    },
    errorText: {
      color: '#ff4d4d',
      fontSize: 12,
      marginTop: 4,
    },
  })
}
