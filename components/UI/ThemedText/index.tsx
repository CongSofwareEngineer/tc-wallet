import { StyleSheet, Text, type TextProps } from 'react-native'

import useTheme from '@/hooks/useTheme'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
  opacity?: number
}

export default function ThemedText({ opacity = 1, style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const { text } = useTheme()

  return (
    <Text
      // ellipsizeMode=''
      style={[
        { color: text.color, flexShrink: 1 },
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
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
})
