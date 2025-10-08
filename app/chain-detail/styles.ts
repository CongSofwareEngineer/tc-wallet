import { StyleSheet } from 'react-native'

import { PADDING_DEFAULT } from '@/constants/style'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    padding: PADDING_DEFAULT.Padding16,
  },
  content: {
    flex: 1,
  },
  card: {
    // backgroundColor: '#F5F5F5',
    borderRadius: 16,
    // padding: 20,
    // marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    // backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  rpcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rpcText: {
    flex: 1,
    fontSize: 16,
  },
  rpcSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  failoverTag: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  failoverText: {
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    // position: 'absolute',
    // bottom: 30,
    // left: 20,
    // right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
})

export default styles
