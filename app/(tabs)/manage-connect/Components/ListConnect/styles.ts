import { StyleSheet } from 'react-native'

import { COLORS, MODE, PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
  },
  sessionCard: {
    borderRadius: 16,
    padding: PADDING_DEFAULT.Padding16,
    marginBottom: 16,
    // marginHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
  },
  [`sessionCard${MODE.Dark}`]: {
    backgroundColor: COLORS.black2,
    borderColor: COLORS.gray2,
  },
  [`sessionCard${MODE.Light}`]: {
    backgroundColor: COLORS.white,
    borderColor: '#F0F0F0',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dappIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
  },
  sessionMeta: {
    flex: 1,
  },
  dappName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dappUrl: {
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00c85034',
    borderColor: '#02a944ff',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontWeight: '600',
    // color: '#FFFFFF',
    marginLeft: 4,
  },
  disconnectButton: {
    backgroundColor: '#FF6B6B',
    width: 30,
    height: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectText: {
    fontWeight: '600',
    // color: '#FFFFFF',
  },
  connectionDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#666666',
    marginBottom: 2,
  },
  detailValue: {},
  chainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chainChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainText: {
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '700',
    // color: isDark ? '#FFFFFF' : '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    // color: isDark ? '#999999' : '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  disconnectAllButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    alignItems: 'center',
  },
  disconnectAllText: {
    fontWeight: '600',
    // color: '#FFFFFF',
  },
})

export default styles
