import { StyleSheet } from 'react-native'

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
    },
    chainIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingHorizontal: 6,
    },
    headerTitle: {
      fontSize: 16,
      color: colors.text || '#FFFFFF',
      fontWeight: '700',
    },
    chip: {
      backgroundColor: colors.black2 || 'rgba(255,255,255,0.08)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    chipText: {
      fontSize: 12,
      color: colors.textSecondary || '#A0A0A0',
      fontWeight: '600',
    },
    sectionBox: {
      backgroundColor: colors.black2 || '#1C1C1E',
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border || 'rgba(255,255,255,0.08)',
      marginBottom: 10,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    sectionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text || '#FFFFFF',
      marginBottom: 0,
    },
    sectionChevron: {
      marginRight: 8,
    },
    sectionContent: {
      marginTop: 8,
    },
    code: {
      fontFamily: 'Courier',
      fontSize: 12,
      lineHeight: 18,
      color: colors.text || '#FFFFFF',
    },
    muted: {
      color: colors.textSecondary || '#A0A0A0',
    },
    iconButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: 'transparent',
    },
  })

export default createLocalStyles
