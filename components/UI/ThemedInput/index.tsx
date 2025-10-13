import { ReactNode, useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

import useTheme from '@/hooks/useTheme'

import ThemedText from '../ThemedText'

import { styles } from './styles'
import stylesCss from './styles.module.css'

export type ThemedInputProps = {
  lightColor?: string
  darkColor?: string
  label?: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onPressRightIcon?: () => any
  onPressLeftIcon?: () => any
  showCount?: boolean
  countConfig?: TextInputProps
  ref?: any
  noBorder?: boolean
  disabled?: boolean
} & TextInputProps

const ThemedInput = ({
  showCount,
  onPressRightIcon,
  onPressLeftIcon,
  style,
  label,
  rightIcon,
  leftIcon,
  lightColor,
  darkColor,
  ref,
  noBorder,
  disabled,
  ...props
}: ThemedInputProps) => {
  const { background, text } = useTheme()
  const [isPassword, setIsPassword] = useState(props?.secureTextEntry)

  return (
    <View style={[styles.container]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={[styles.containerSub, { width: '100%', backgroundColor: background.backgroundInput }, noBorder && { borderWidth: 0 }]}>
        {leftIcon && (
          <TouchableOpacity style={styles.leftIcon} onPress={() => onPressLeftIcon?.()}>
            <ThemedText>{leftIcon}</ThemedText>
          </TouchableOpacity>
        )}
        <TextInput
          ref={ref}
          className={stylesCss.input}
          placeholderTextColor={text.colorPlaceholder}
          style={[
            {
              $$css: true,
              _: 'input',
            },
            { opacity: disabled ? 0.5 : 1, width: '100%', backgroundColor: 'transparent', color: text.color, fontSize: 16, flex: 1, paddingLeft: 0 },
            style,
          ]}
          {...props}
          secureTextEntry={isPassword}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => {
              if (props?.secureTextEntry) {
                setIsPassword((value) => !value)
              }
              onPressRightIcon?.()
            }}
          >
            <ThemedText>{rightIcon}</ThemedText>
          </TouchableOpacity>
        )}
        {disabled && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 8 }} />}
      </View>

      {showCount && props?.maxLength && (
        <ThemedText {...props?.countConfig} style={[styles.count, { width: '100%', textAlign: 'right' }]} className={props?.countConfig?.className}>
          {props?.value?.length ?? 0}
          {props?.maxLength && `/${props?.maxLength}`}
        </ThemedText>
      )}
    </View>
  )
}

export default ThemedInput
