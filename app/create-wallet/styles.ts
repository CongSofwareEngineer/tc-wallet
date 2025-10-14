import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, MODE, PADDING_DEFAULT } from '@/constants/style'

// Gradient from left (#00d4ff at 0%) to right (#8b5cf6 at 100%).
// Use with expo-linear-gradient:
// <LinearGradient {...containerLogoGradient} style={styles.containerLogo} />
export const containerLogoGradient = {
  colors: ['#00d4ff', '#8b5cf6'],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
  locations: [0, 1],
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContent: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
    gap: GAP_DEFAULT.Gap12,
    justifyContent: 'center',
    alignContent: 'center',
    padding: PADDING_DEFAULT.Padding20,
    width: '100%',
  },
  [`containerContent${MODE.Dark}`]: {
    borderColor: COLORS.gray2,
    backgroundColor: COLORS.black3,
  },
  [`containerContent${MODE.Light}`]: {},
  containerLogo: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#8b5cf6',
    padding: PADDING_DEFAULT.Padding16,
  },
  button: {
    width: '100%',
  },
  line: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    height: 1,
    backgroundColor: COLORS.gray2,
    flex: 1,
  },
})

export default styles
