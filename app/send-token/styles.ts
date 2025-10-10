import { StyleSheet } from 'react-native'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    card: {
      backgroundColor: isDark ? '#151515' : '#f5f7fa',
      borderRadius: 12,
      padding: 12,
      gap: 6,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    input: {
      flex: 1,
      color: isDark ? '#fff' : '#000',
      fontSize: 16,
      paddingVertical: 6,
    },
    inputPrefix: {
      color: isDark ? '#9AA0A6' : '#6D6D70',
      fontWeight: '600',
      width: 70,
    },
    iconButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#333' : '#ddd',
    },
    keypad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#151515' : '#f5f7fa',
      borderRadius: 12,
      padding: 12,
    },
    key: {
      width: '30.5%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    },
    keyText: {
      fontSize: 18,
      color: isDark ? '#fff' : '#000',
      fontWeight: '600',
    },
    tokenItem: {
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? '#2a2a2a' : '#e5e5e5',
    },
  })

export type Styles = ReturnType<typeof createStyles>
