import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

// Web-only CSS module for spinner

// @ts-ignore - CSS modules are for web builds only
import './myLoading.module.web.css'

type Props = {
  size?: number
  color?: string
  variant?: 'sm' | 'md' | 'lg'
}

const MyLoading = ({ size = 50, color, variant = 'md' }: Props) => {
  // On web, use a lightweight CSS spinner
  // if (Platform.OS === 'web') {
  //   const classNames = [stylesWeb.spinner]
  //   if (variant && stylesWeb[`spinner--${variant}`]) classNames.push(stylesWeb[`spinner--${variant}`])
  //   // Default to dark theme look; caller can override via color
  //   classNames.push(stylesWeb['spinner--dark'])

  //   const styleVars = {
  //     // Use provided size if any
  //     ['--spinner-size' as any]: `${size}px`,
  //     ...(color ? ({ ['--spinner-color' as any]: color } as any) : {}),
  //   } as any

  //   return <View className={classNames.join(' ')} style={styleVars} />
  // }

  // Native (iOS/Android) animated spinner
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
      <AntDesign
        style={{
          $$css: true,
          _: 'spinner',
        }}
        name='loading-3-quarters'
        size={size}
        color={color || 'white'}
      />
    </Animated.View>
  )
}

export default MyLoading
