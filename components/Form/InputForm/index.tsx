import { Controller } from 'react-hook-form'
import { View } from 'react-native'

import ThemedInput, { ThemedInputProps } from '@/components/UI/ThemedInput'
import ThemedText, { ThemedTextProps } from '@/components/UI/ThemedText'
import { COLORS } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'

import styles from './styles'

type Props = {
  configLabel?: ThemedTextProps
  configInput?: ThemedInputProps
  configError?: ThemedTextProps
  control: any
  showError?: boolean
  name: string
  required?: boolean
  errors?: any
  errorsText?: any
  label?: string
  placeholder?: string
  hiddenError?: boolean
}
const InputForm = ({
  placeholder,
  configInput,
  configError,
  label,
  errors,
  configLabel,
  control,
  name,
  showError = true,
  required = false,
  errorsText,
  hiddenError = false,
}: Props) => {
  const { translate } = useLanguage()

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText {...configLabel} style={[styles.label, configLabel?.style]}>
          {label}
        </ThemedText>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={placeholder} {...configInput} onBlur={onBlur} onChangeText={(value) => onChange(value)} value={value} />
        )}
        name={name}
        rules={{ required: required }}
      />
      {!hiddenError && (
        <ThemedText
          {...configError}
          style={[styles.error, { opacity: showError && errors ? 1 : 0, fontSize: 12, color: COLORS.red }, configError?.style]}
        >
          {errorsText || translate('warning.required')}
        </ThemedText>
      )}
    </View>
  )
}

export default InputForm
