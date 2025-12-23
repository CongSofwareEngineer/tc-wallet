import { ReactNode, useState } from 'react'
import { StyleProp, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native'

import useTheme from '@/hooks/useTheme'

import ThemedText from '../ThemedText'

import { width } from '@/utils/systems'
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
  styleContentInput?: StyleProp<ViewStyle>
  error?: ReactNode
  showError?: boolean
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
  styleContentInput,
  error,
  showError,
  ...props
}: ThemedInputProps) => {
  const { background, text } = useTheme()
  const [isPassword, setIsPassword] = useState(props?.secureTextEntry)

  const onChangeText = (text: string) => {
    if (props?.keyboardType === 'numeric' || props?.inputMode === 'numeric') {
      text = text.replaceAll(',', '.')
      // Remove any non-numeric characters except for a single decimal point
      const numericText = text.replace(/[^0-9.]/g, '')
      text = numericText

      const firstDotIndex = text.indexOf('.')

      if (firstDotIndex !== -1) {
        // Nếu có dấu chấm, chỉ giữ lại dấu chấm đầu tiên và xóa các dấu chấm sau
        text = text.substring(0, firstDotIndex + 1) + text.substring(firstDotIndex + 1).replace(/\./g, '')
      }

      if (text?.startsWith('.') === true) {
        text = ''
      }
    }
    props?.onChangeText?.(text)
  }

  return (
    <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View
        style={[
          styles.containerSub,
          { width: '100%', backgroundColor: background.backgroundInput },
          noBorder && { borderWidth: 0 },
          styleContentInput,
        ]}
      >
        {leftIcon && (
          <TouchableOpacity style={styles.leftIcon} onPress={() => onPressLeftIcon?.()}>
            {typeof leftIcon === 'string' ? <ThemedText>{leftIcon}</ThemedText> : leftIcon}
          </TouchableOpacity>
        )}
        <TextInput
          ref={ref}
          className={stylesCss.input}
          placeholderTextColor={text.colorPlaceholder}
          style={[{ outline: 'none', backgroundColor: 'transparent', color: text.color, fontSize: width(5), flex: 1, paddingLeft: 0 }, style]}
          {...props}
          editable={!disabled}
          onChangeText={onChangeText}
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
            {typeof rightIcon === 'string' ? <ThemedText>{rightIcon}</ThemedText> : rightIcon}
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
      {(showError || error) && (
        <ThemedText type='small' style={[styles.error, { opacity: error ? 1 : 0 }]}>
          {error || 'error'}
        </ThemedText>
      )}
    </View>
  )
}

export default ThemedInput
