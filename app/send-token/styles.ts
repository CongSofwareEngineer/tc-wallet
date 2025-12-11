import { StyleSheet } from 'react-native'

import { COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.black : COLORS.lightBg,
    },
    scrollContent: {
      padding: PADDING_DEFAULT.Padding16,
      gap: GAP_DEFAULT.Gap12,
    },
    card: {
      backgroundColor: isDark ? COLORS.grayDark : COLORS.whiteLight,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? '#2A2A2A' : 'transparent',
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? COLORS.gray : COLORS.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    walletRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    walletInfo: {
      flex: 1,
      gap: 4,
    },
    walletName: {
      fontWeight: '600',
      color: isDark ? COLORS.whiteLight : COLORS.black3,
    },
    walletAddress: {
      color: isDark ? COLORS.gray : COLORS.gray,
    },
    sendButton: {
      backgroundColor: COLORS.blue2,
      paddingHorizontal: 24,
      paddingVertical: 6,
      borderRadius: 12,
      shadowColor: '#3B82F6',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      transform: [{ scale: 1 }],
    },
    sendButtonDisabled: {
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
      shadowOpacity: 0,
      transform: [{ scale: 0.98 }],
    },
    sendButtonText: {
      color: COLORS.whiteLight,
      fontSize: 16,
      fontWeight: '600',
    },
    sendButtonTextDisabled: {
      color: isDark ? COLORS.gray : COLORS.gray,
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    inputContainerFocused: {
      borderColor: COLORS.blue2,
      backgroundColor: isDark ? COLORS.black3 : COLORS.lightBg,
    },
    input: {
      fontSize: 16,
      color: isDark ? COLORS.whiteLight : COLORS.black3,
      paddingVertical: 0,
      fontWeight: '500',
      backgroundColor: 'transparent',
    },
    inputActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    iconButtonActive: {
      // backgroundColor: '#3B82F6',
      // shadowColor: '#3B82F6',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 24,
    },
    chainIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    tokenSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? COLORS.black : COLORS.lightBg,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    tokenInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    tokenIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    tokenDetails: {
      flex: 1,
      gap: 2,
    },
    tokenSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.whiteLight : COLORS.black3,
    },
    tokenBalance: {
      fontSize: 14,
      color: isDark ? COLORS.gray : COLORS.gray,
    },
    amountCard: {
      backgroundColor: isDark ? COLORS.black : COLORS.lightBg,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 0,
      // gap: 16,
      borderWidth: 2,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    amountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    amountLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.whiteLight : COLORS.black3,
    },
    maxButton: {
      backgroundColor: COLORS.blue2,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      shadowColor: '#3B82F6',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    maxButtonText: {
      color: COLORS.whiteLight,
      fontSize: 12,
      fontWeight: '600',
    },
    feeCard: {
      backgroundColor: isDark ? COLORS.lightWarning : COLORS.lightWarning,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: COLORS.yellow2,
    },
    feeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    feeLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: COLORS.textBrown,
    },
    feeValue: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textBrown,
    },
    resultCard: {
      backgroundColor: isDark ? COLORS.green4 : COLORS.lightSuccess,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? COLORS.green3 : COLORS.green5,
    },
    errorCard: {
      backgroundColor: isDark ? COLORS.red1 : COLORS.lightError,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? COLORS.red : COLORS.red,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    resultText: {
      fontSize: 14,
      lineHeight: 20,
    },
    tokenItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
      gap: 12,
    },
    tokenItemContent: {
      flex: 1,
      gap: 4,
    },
    tokenItemSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? COLORS.whiteLight : COLORS.black3,
    },
    tokenItemBalance: {
      fontSize: 14,
      color: isDark ? COLORS.gray : COLORS.gray,
    },
    tokenItemName: {
      fontSize: 14,
      color: isDark ? COLORS.gray : COLORS.gray,
    },
  })

export type Styles = ReturnType<typeof createStyles>

export default () => { }
