import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, COLORS, GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'

export const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? COLORS.black : COLORS.lightBg,
    },
    scrollContent: {
      flexGrow: 1,
      padding: PADDING_DEFAULT.Padding20,
    },
    form: {
      gap: GAP_DEFAULT.Gap20,
      marginBottom: GAP_DEFAULT.Gap32,
    },
    input: {
      fontSize: 16,
    },
    buttonContainer: {
      marginBottom: GAP_DEFAULT.Gap24,
    },
    button: {
      paddingVertical: PADDING_DEFAULT.Padding16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: COLORS.whiteLight,
      fontSize: 16,
    },
    infoContainer: {
      marginTop: 'auto',
    },
    infoBox: {
      backgroundColor: isDark ? COLORS.black2 : COLORS.lightWarning,
      padding: PADDING_DEFAULT.Padding16,
      borderRadius: BORDER_RADIUS_DEFAULT.Radius8,
      borderWidth: 1,
      borderColor: COLORS.yellow2,
    },
    errorText: {
      color: COLORS.red,
      marginTop: 4,
      marginLeft: 4,
    },
  })

export type Styles = ReturnType<typeof createStyles>
