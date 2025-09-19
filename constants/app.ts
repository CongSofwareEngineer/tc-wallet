import { Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const IS_NOTCH_ANDROID = Platform.OS === 'android' && DeviceInfo.hasNotch()
export const HAS_NOTCH = DeviceInfo.hasNotch()

export const HEIGHT_SCREEN = Dimensions.get('window').height
export const WIDTH_SCREEN = Dimensions.get('window').width

export const IsIos = Platform.OS === 'ios'
