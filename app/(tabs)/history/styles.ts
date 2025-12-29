import { COLORS, GAP_DEFAULT, MODE, PADDING_DEFAULT } from '@/constants/style'
import { StyleSheet } from 'react-native'

export const getStyles = (mode: MODE, isDark: boolean) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: PADDING_DEFAULT.Padding16,
      paddingTop: PADDING_DEFAULT.Padding16,
      flex: 1,
    },
    filterContainer: {
      paddingBottom: PADDING_DEFAULT.Padding16,
      gap: GAP_DEFAULT.Gap12,
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GAP_DEFAULT.Gap8,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 100,
      backgroundColor: isDark ? COLORS.black2 : COLORS.lightBg,
      borderWidth: 1,
      borderColor: isDark ? COLORS.black3 : COLORS.gray1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    filterButtonActive: {
      backgroundColor: COLORS.green3,
      borderColor: COLORS.green3,
    },
    filterText: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? COLORS.gray : COLORS.gray2,
    },
    filterTextActive: {
      fontWeight: '600',
    },
  })
}
