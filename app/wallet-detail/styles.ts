import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#18181B',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 8,
  },
  addressValue: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
  },
  saveButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  hiddenContent: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    // flexDirection: 'row',
    // alignItems: 'center',
    gap: 8,
  },
  hiddenText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
  },
  dangerSection: {
    marginTop: 20,
  },
  dangerText: {
    color: '#EF4444',
  },
})

export default styles
