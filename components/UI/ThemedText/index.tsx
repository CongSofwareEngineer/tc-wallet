import { StyleSheet, Text, type TextProps } from 'react-native'

import useTheme from '@/hooks/useTheme'
import { width } from '@/utils/systems'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small'
  opacity?: number
}

export default function ThemedText({ opacity = 1, style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const { text } = useTheme()

  return (
    <Text
      allowFontScaling={false}
      style={[
        { color: text.color, flexShrink: 1 },
        type === 'small' ? styles.small : undefined,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        { opacity },
        style,
      ]}
      numberOfLines={undefined}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  small: {
    fontSize: width(3),
    lineHeight: width(4),
  },
  default: {
    fontSize: width(4),
    lineHeight: width(6),
  },
  defaultSemiBold: {
    fontSize: width(4),
    lineHeight: width(6),
    fontWeight: '600',
  },
  title: {
    fontSize: width(6),
    fontWeight: 'bold',
    lineHeight: width(7),
  },
  subtitle: {
    fontSize: width(5),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: width(7),
    fontSize: width(4),
    color: '#0a7ea4',
  },
})
