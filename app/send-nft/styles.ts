import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import { width } from '@/utils/systems'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.black : COLORS.lightBg,
    },
    scrollContent: {
      paddingHorizontal: PADDING_DEFAULT.Padding16,
      paddingVertical: PADDING_DEFAULT.Padding16,
      gap: GAP_DEFAULT.Gap12,
    },
    card: {
      backgroundColor: isDark ? COLORS.grayDark : COLORS.whiteLight,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? COLORS.black2 : 'transparent',
    },
    sectionLabel: {
      fontWeight: '600',
      color: COLORS.gray,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    nftPreviewContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    nftImage: {
      width: width(20),
      height: width(20),
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    nftDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    nftName: {
      fontWeight: '700',
      color: isDark ? COLORS.white : COLORS.black,
    },
    nftType: {
      fontWeight: '500',
      color: COLORS.gray,
    },
    nftTokenId: {
      color: COLORS.gray,
    },
    nftContract: {
      color: COLORS.gray,
      fontFamily: 'monospace',
    },
    walletName: {
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    walletAddress: {
      color: COLORS.gray,
    },
    sendButton: {
      backgroundColor: COLORS.blue2,
      paddingHorizontal: 24,
      paddingVertical: 6,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
      shadowColor: COLORS.blue2,
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
      color: COLORS.white,
      fontWeight: '600',
    },
    sendButtonTextDisabled: {
      color: COLORS.gray,
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? COLORS.gray2 : COLORS.gray1,
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
      borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    iconButtonActive: {
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    chainIcon: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      borderWidth: 2,
      borderColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
    feeCard: {
      backgroundColor: COLORS.lightWarning,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
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
      fontWeight: '500',
      color: COLORS.textBrown,
    },
    feeValue: {
      fontWeight: '600',
      color: COLORS.textBrown,
    },
    resultCard: {
      backgroundColor: isDark ? COLORS.green4 : COLORS.lightSuccess,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? COLORS.green3 : COLORS.green600,
    },
    errorCard: {
      backgroundColor: isDark ? COLORS.red1 : COLORS.lightError,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.red,
    },
    resultTitle: {
      fontWeight: '600',
      marginBottom: 8,
    },
    resultText: {
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
      fontWeight: '600',
      color: isDark ? COLORS.white : COLORS.black,
    },
    tokenItemBalance: {
      color: COLORS.gray,
    },
    tokenIcon: {
      width: 36,
      height: 36,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius16,
      backgroundColor: isDark ? COLORS.gray2 : COLORS.gray1,
    },
  })

export type Styles = ReturnType<typeof createStyles>

export default () => { }
