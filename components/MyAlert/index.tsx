import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Modal, View } from 'react-native'
import { useDispatch } from 'react-redux'

import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import { useAppSelector } from '@/redux/hooks'
import { closeAlert } from '@/redux/slices/alertSlice'

import ThemedText from '../UI/ThemedText'

const { width: screenWidth } = Dimensions.get('window')

const MyAlert = () => {
  const alert = useAppSelector((state) => state.alert)
  const dispatch = useDispatch()
  const { isDark } = useMode()
  const { colors } = useTheme()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(-50)).current

  useEffect(() => {
    if (alert?.text) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Auto hide after duration
      const timer = setTimeout(() => {
        // Animate out
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          dispatch(closeAlert())
        })
      }, alert.duration || 2000)

      return () => clearTimeout(timer)
    }
  }, [alert, dispatch, fadeAnim, translateYAnim])

  if (!alert?.text) {
    return null
  }

  return (
    <Modal transparent visible={!!alert?.text} animationType='none'>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999999999999,
          pointerEvents: 'none', // Cho phép tương tác qua alert,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
            backgroundColor: isDark ? colors?.black3 : colors?.white,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            marginHorizontal: 40,
            maxWidth: screenWidth - 80,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: isDark ? 0.4 : 0.2,
            shadowRadius: 8,
            elevation: 8,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors?.gray2 : 'transparent',
          }}
        >
          <ThemedText
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 22,
            }}
          >
            {alert.text}
          </ThemedText>
        </Animated.View>
      </View>
    </Modal>
  )
}

export default MyAlert
