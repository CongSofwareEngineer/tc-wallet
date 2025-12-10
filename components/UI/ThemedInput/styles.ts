import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerSub: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 0,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#374151',
    borderWidth: 1,
    minHeight: 40,
    position: 'relative',
  },
  label: {
    width: '100%',
    marginBottom: 5,
  },
  leftIcon: {
    marginRight: 5,
  },
  rightIcon: {
    marginLeft: 5,
  },
  input: {
    color: '#000',
    flex: 1,
    paddingLeft: 0,
    borderColor: 'transparent',
  },

  count: {
    fontSize: 12,
    color: '#888',
  },
  error: {
    color: 'red',
    width: '100%',
  },
  success: {
    color: 'green',
    fontSize: 12,
    marginTop: 5,
  },
  containerError: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
  },
})
