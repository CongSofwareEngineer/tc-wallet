import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  headerCellLeft: {
    flex: 2,
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 16,
  },
  headerCellRight: {
    flex: 1,
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#18181B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#23232A',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#333',
  },
  nameText: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  balanceText: {
    flex: 1,
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#23232A',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F0F0F',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#23232A',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderRadius: 6,
    gap: 4,
  },
  addAccountText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 12,
  },
})

export default () => { }
