import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import { StyleSheet } from 'react-native'

const createStyles = (isDark = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.black : COLORS.white,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: PADDING_DEFAULT.Padding16,
      paddingBottom: 40,
    },
    accountSection: {
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding16,
      marginBottom: GAP_DEFAULT.Gap16,
    },
    accountLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
      marginBottom: 4,
    },
    accountAddress: {
      fontSize: 14,
      color: isDark ? COLORS.gray : COLORS.gray2,
      marginBottom: GAP_DEFAULT.Gap12,
    },
    balanceSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    balanceLabel: {
      fontSize: 14,
      color: isDark ? COLORS.white : COLORS.black,
    },
    maximumBtn: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.blue,
    },
    section: {
      backgroundColor: isDark ? COLORS.black2 : COLORS.gray1,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      padding: PADDING_DEFAULT.Padding16,
      marginBottom: GAP_DEFAULT.Gap12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: GAP_DEFAULT.Gap12,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    chainSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    chainIcon: {
      fontSize: 18,
    },
    chainName: {
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? COLORS.white : COLORS.black,
    },
    chevron: {
      fontSize: 22,
      color: isDark ? COLORS.gray : COLORS.gray2,
      fontWeight: '300',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: GAP_DEFAULT.Gap12,
    },
    tokenSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.white,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
      paddingHorizontal: PADDING_DEFAULT.Padding12,
      paddingVertical: PADDING_DEFAULT.Padding10,
      minWidth: 100,
    },
    tokenIcon: {
      fontSize: 24,
    },
    tokenSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    amountInput: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'right',
      paddingVertical: PADDING_DEFAULT.Padding10,
    },
    arrowContainer: {
      alignItems: 'center',
      marginVertical: GAP_DEFAULT.Gap8,
    },
    arrowIcon: {
      fontSize: 24,
      color: isDark ? COLORS.gray : COLORS.gray2,
    },
    selectCoinButton: {
      width: '100%',
    },
    selectCoinContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: PADDING_DEFAULT.Padding12,
    },
    selectCoinText: {
      fontSize: 16,
      color: isDark ? COLORS.gray : COLORS.gray2,
    },
    confirmButton: {
      marginTop: GAP_DEFAULT.Gap24,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      paddingVertical: PADDING_DEFAULT.Padding16,
      alignItems: 'center',
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.white,
    },
    footer: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: GAP_DEFAULT.Gap16,
    },
    footerText: {
      fontSize: 11,
      color: isDark ? COLORS.gray : COLORS.gray2,
      letterSpacing: 1,
    },
    footerBrand: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? COLORS.gray : COLORS.gray2,
      marginTop: 4,
    },
    termsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: PADDING_DEFAULT.Padding16,
    },
    termsText: {
      fontSize: 13,
      textAlign: 'center',
      color: isDark ? COLORS.gray : COLORS.gray2,
      lineHeight: 20,
    },
    termsLink: {
      fontSize: 13,
      color: COLORS.blue,
      fontWeight: '500',
      lineHeight: 20,
    },
  })

export default createStyles
