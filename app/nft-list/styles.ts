import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'

const createStyles = (isDarkMode = false) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
    },
    header: {
      backgroundColor: isDarkMode ? COLORS.black2 : COLORS.white,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
      marginBottom: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: isDarkMode ? COLORS.white : COLORS.black,
    },
    clearButton: {
      padding: 4,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    filterButtonActive: {
      backgroundColor: isDarkMode ? COLORS.green3 : COLORS.green4,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDarkMode ? COLORS.gray : COLORS.gray2,
    },
    filterButtonTextActive: {
      color: COLORS.white,
    },
    viewToggleContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
      borderRadius: 8,
      padding: 2,
    },
    viewToggleButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    viewToggleButtonActive: {
      backgroundColor: isDarkMode ? COLORS.black3 : COLORS.white,
    },
    countText: {
      fontSize: 14,
      color: isDarkMode ? COLORS.gray : COLORS.gray2,
      marginTop: 8,
    },
    contentContainer: {
      padding: 16,
    },
    gridContainer: {
      gap: 12,
    },
    gridItem: {
      flex: 1,
      margin: 6,
      backgroundColor: isDarkMode ? COLORS.black2 : COLORS.white,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
    },
    nftImage: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
    },
    nftInfo: {
      padding: 12,
    },
    nftName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? COLORS.white : COLORS.black,
      marginBottom: 4,
    },
    nftCollection: {
      fontSize: 12,
      color: isDarkMode ? COLORS.gray : COLORS.gray2,
      marginBottom: 6,
    },
    nftDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nftId: {
      fontSize: 11,
      color: isDarkMode ? COLORS.gray2 : COLORS.gray,
    },
    nftChain: {
      fontSize: 10,
      color: isDarkMode ? COLORS.green5 : COLORS.green3,
      fontWeight: '500',
    },
    listItem: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? COLORS.black2 : COLORS.white,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
    },
    listNftImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
      marginRight: 12,
    },
    listNftInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    listNftTop: {},
    listNftBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? COLORS.gray : COLORS.gray2,
      marginTop: 12,
    },
    emptySubtext: {
      fontSize: 14,
      color: isDarkMode ? COLORS.gray2 : COLORS.gray,
      marginTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    badge: {
      backgroundColor: isDarkMode ? COLORS.gray2 : COLORS.gray1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: isDarkMode ? COLORS.gray : COLORS.gray2,
    },
  })
}

export default createStyles
