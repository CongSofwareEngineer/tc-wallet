import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  cryptoList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  cryptoIcon: {
    width: 45,
    height: 45,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
    flexShrink: 1,
    maxWidth: '95%',
  },
  cryptoBalance: {
    color: '#999999',
    fontWeight: '400',
  },
  cryptoChange: {
    fontWeight: '500',
    textAlign: 'right',
  },
})

export default () => { }
