import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

const MyLoading = ({ size = 50 }) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const loopRef = useRef<Animated.CompositeAnimation | null>(null)
  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  useEffect(() => {
    spinValue.setValue(0)
    loopRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loopRef.current.start()
  }, [spinValue])

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <AntDesign name='loading-3-quarters' size={size} color='white' />
    </Animated.View>
  )
}

export default MyLoading
