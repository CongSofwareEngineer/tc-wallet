import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import { width } from '@/utils/systems'

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: PADDING_DEFAULT.Padding16,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    card: {
      backgroundColor: isDark ? COLORS.black3 : COLORS.whiteLight,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding16,
      marginBottom: GAP_DEFAULT.Gap16,
      borderWidth: 1,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: GAP_DEFAULT.Gap12,
    },
    chainSelectorSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: 24,
      padding: 8,
    },
    sectionLabel: {
      fontSize: width(3.5),
      fontWeight: '600',
      opacity: 0.7,
    },
    balanceText: {
      fontSize: width(3.5),
      opacity: 0.7,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: GAP_DEFAULT.Gap8,
      marginBottom: GAP_DEFAULT.Gap8,
    },
    tokenSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16, // Pill shape
      paddingVertical: 6,
      paddingHorizontal: 12,
      minWidth: 100,
    },
    tokenIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    tokenSymbol: {
      fontSize: width(4),
      fontWeight: '600',
      marginRight: 4,
    },
    tokenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
      padding: PADDING_DEFAULT.Padding12,
      marginBottom: GAP_DEFAULT.Gap12,
    },
    tokenInfo: {
      flex: 1,
    },
    tokenBalance: {
      fontSize: width(3),
      opacity: 0.6,
      marginTop: 2,
    },
    inputArea: {
      // marginTop: GAP_DEFAULT.Gap8,
    },
    swapDirectionContainer: {
      alignItems: 'center',
      zIndex: 10,
      marginBottom: GAP_DEFAULT.Gap16,
    },
    swapDirectionButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: isDark ? COLORS.green3 : COLORS.green600,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: isDark ? COLORS.black : COLORS.whiteLight,
    },
    maxButton: {
      backgroundColor: isDark ? 'rgba(39, 174, 96, 0.2)' : 'rgba(39, 174, 96, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginLeft: 8,
    },
    maxButtonText: {
      color: isDark ? COLORS.green3 : COLORS.green600,
      fontWeight: '600',
      fontSize: 12,
    },
    detailsCard: {
      backgroundColor: isDark ? COLORS.black3 : COLORS.lightBg,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding16,
      marginBottom: GAP_DEFAULT.Gap16,
      marginTop: GAP_DEFAULT.Gap8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: GAP_DEFAULT.Gap8,
    },
    detailLabel: {
      fontSize: width(3.5),
      opacity: 0.7,
    },
    detailValue: {
      fontSize: width(3.5),
      fontWeight: '600',
      textAlign: 'right',
    },
    swapButton: {
      backgroundColor: isDark ? COLORS.green3 : COLORS.green600,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding16,
      alignItems: 'center',
      marginTop: GAP_DEFAULT.Gap8,
    },
    swapButtonDisabled: {
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
      opacity: 0.5,
    },
    swapButtonText: {
      color: COLORS.whiteLight,
      fontSize: width(4.5),
      fontWeight: '700',
    },
    swapButtonTextDisabled: {
      color: isDark ? COLORS.gray : COLORS.gray2,
    },
    chainSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding12,
    },
    chainIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    chainName: {
      fontSize: width(3.5),
      fontWeight: '500',
      flex: 1,
    },
    usdValue: {
      fontSize: width(3),
      opacity: 0.6,
      textAlign: 'right',
    },
  })

export default createStyles
