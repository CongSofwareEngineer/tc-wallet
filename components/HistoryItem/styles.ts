import { COLORS, GAP_DEFAULT, MODE, PADDING_DEFAULT, TEXT } from '@/constants/style'
import { StyleSheet } from 'react-native'

export const getStyles = (mode: MODE, isDark: boolean) => {
  const text = TEXT[mode]

  return StyleSheet.create({
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: PADDING_DEFAULT.Padding12,
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? COLORS.black3 : COLORS.gray1,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: GAP_DEFAULT.Gap12,
      backgroundColor: isDark ? COLORS.black2 : COLORS.lightBg,
      overflow: 'hidden',
    },
    nftImage: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    infoContainer: {
      flex: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: text.color,
    },
    value: {
      fontSize: 14,
      fontWeight: '500',
    },
    subInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    subtitle: {
      fontSize: 12,
      color: COLORS.gray,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
  })
}
