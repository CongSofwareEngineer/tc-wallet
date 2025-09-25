import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useModal from '@/hooks/useModal'
import useTheme from '@/hooks/useTheme'

type ModalWarningProps = {
  title?: string | React.ReactNode
  message?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
  type?: 'warning' | 'error' | 'danger'
}

const ModalWarning: React.FC<ModalWarningProps> = ({
  title = 'Cảnh báo',
  message = 'Bạn có chắc muốn thực hiện thao tác này?',
  confirmText = 'Đồng ý',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  const { colors, text } = useTheme()
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm?.()
    } finally {
      setLoading(false)
      closeModal()
    }
  }

  const handleCancel = async () => {
    try {
      await onCancel?.()
    } finally {
      closeModal()
    }
  }

  const renderIcon = (type: 'warning' | 'error' | 'danger') => {
    switch (type) {
      case 'warning':
        return <AntDesign name={'warning'} size={50} color={colors.yellow1} />

      case 'danger':
        return <MaterialIcons name='dangerous' size={50} color={colors.red} />
      default:
        return <AntDesign name={'warning'} size={50} color={colors.yellow1} />
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.black3 }]}>
      {typeof title === 'string' ? (
        <ThemedText type='subtitle' style={styles.title}>
          {title}
        </ThemedText>
      ) : (
        title
      )}
      <View style={{ margin: 10 }}>{renderIcon(type)}</View>

      {typeof message === 'string' ? <ThemedText style={styles.message}>{message}</ThemedText> : message}

      <View style={styles.actions}>
        <ThemeTouchableOpacity disabled={loading} style={styles.button} onPress={handleCancel} type='default'>
          <ThemedText> {cancelText} </ThemedText>
        </ThemeTouchableOpacity>
        <ThemeTouchableOpacity style={styles.button} onPress={handleConfirm} type='danger' loading={loading}>
          <ThemedText> {confirmText} </ThemedText>
        </ThemeTouchableOpacity>
      </View>
    </View>
  )
}

export default ModalWarning

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 16,
    minWidth: 280,
    maxWidth: 360,
    alignSelf: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    textAlign: 'center',
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
})
