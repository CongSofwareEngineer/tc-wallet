import React, { useMemo, useRef, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { KEY_STORAGE } from '@/constants/storage'
import useTheme from '@/hooks/useTheme'
import { getSecureData } from '@/utils/secureStorage'

type Props = {
  callback: (result: boolean) => void
}

const PIN_LENGTH = 4

const ModalAuth = ({ callback }: Props) => {
  const { background, text, colors } = useTheme()
  const inputRef = useRef<TextInput>(null)
  const [pin, setPin] = useState('')

  const boxes = useMemo(() => new Array(PIN_LENGTH).fill(''), [])

  const onChange = async (value: string) => {
    const pass = await getSecureData(KEY_STORAGE.PassAuth)

    // keep only digits and clamp to length
    const digits = value.replace(/\D/g, '').slice(0, PIN_LENGTH)
    setPin(digits)
    if (digits.length === PIN_LENGTH && digits === pass) {
      // slight delay to allow UI to render last dot
      setTimeout(() => callback(true), 80)
    }
  }

  const focusInput = () => inputRef.current?.focus()

  return (
    <View style={[styles.wrapper]}>
      <ThemedText style={[styles.title]}>{'Nhập mật khẩu'}</ThemedText>

      <TouchableOpacity activeOpacity={1} onPress={focusInput} style={styles.pinRow}>
        {boxes.map((_, i) => {
          const filled = i < pin.length
          return (
            <View
              key={`pin-${i}`}
              style={[
                styles.box,
                {
                  backgroundColor: background.backgroundInput || (text.color === colors.white ? colors.black3 : colors.white),
                  borderColor: text.color === colors.white ? '#555' : '#cbd5e1',
                },
              ]}
            >
              <ThemedText style={[styles.dot, { color: text.color }]}>{filled ? '•' : '_'}</ThemedText>
            </View>
          )
        })}
        {/* Hidden input to capture numeric presses */}
        <TextInput
          ref={inputRef}
          value={pin}
          onChangeText={onChange}
          keyboardType='number-pad'
          maxLength={PIN_LENGTH}
          caretHidden
          // Keep invisible but focusable
          style={styles.hiddenInput}
          autoFocus
        />
      </TouchableOpacity>
    </View>
  )
}

export default ModalAuth

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    fontSize: 28,
    lineHeight: 28,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
})
