import { StyleSheet } from 'react-native'

import { COLORS, GAP_DEFAULT } from '@/constants/style'
import { width } from '@/utils/systems'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0A0A0A' : '#F8FAFC',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: GAP_DEFAULT.Gap12,
    },
    card: {
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
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
      color: isDark ? '#9CA3AF' : '#6B7280',
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
      borderRadius: 12,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
    },
    nftDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    nftName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#1F2937',
    },
    nftType: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    nftTokenId: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    nftContract: {
      fontSize: 11,
      color: isDark ? '#6B7280' : '#9CA3AF',
      fontFamily: 'monospace',
    },
    walletName: {
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
    },
    walletAddress: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    sendButton: {
      backgroundColor: '#3B82F6',
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
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      shadowOpacity: 0,
      transform: [{ scale: 0.98 }],
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    sendButtonTextDisabled: {
      color: isDark ? '#6B7280' : '#9CA3AF',
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : COLORS.gray1,
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
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
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
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    feeCard: {
      backgroundColor: isDark ? '#FEF3C7' : '#FEF3C7',
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#F59E0B',
    },
    feeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    feeLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#92400E',
    },
    feeValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#92400E',
    },
    resultCard: {
      backgroundColor: isDark ? '#065F46' : '#ECFDF5',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? '#047857' : '#10B981',
    },
    errorCard: {
      backgroundColor: isDark ? '#7F1D1D' : '#FEF2F2',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? '#DC2626' : '#EF4444',
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
      borderColor: isDark ? '#374151' : '#E5E7EB',
      gap: 12,
    },
    tokenItemContent: {
      flex: 1,
      gap: 4,
    },
    tokenItemSymbol: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
    },
    tokenItemBalance: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    tokenIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
    },
  })

export type Styles = ReturnType<typeof createStyles>

export default () => { }
