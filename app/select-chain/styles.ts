import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  headerAddButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingBottom: PADDING_DEFAULT.Padding20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray2,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
    paddingHorizontal: PADDING_DEFAULT.Padding16,
    height: 44,
    marginHorizontal: PADDING_DEFAULT.Padding16,
    marginTop: GAP_DEFAULT.Gap16,
    marginBottom: GAP_DEFAULT.Gap16,
  },
  searchIcon: {
    marginRight: GAP_DEFAULT.Gap8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: GAP_DEFAULT.Gap16,
  },
  networkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkSymbol: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#0A0A0A',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  networkList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedNetworkItem: {
    borderColor: '#007AFF',
    backgroundColor: '#1A2B3A',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  networkIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  networkName: {
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A2B3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
})

export default () => {}
