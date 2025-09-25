import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'

import styles from '../../styles'

const SignTypedData = ({ params }: { params: RequestWC }) => {
  const { background, colors } = useTheme()
  return (
    <View style={[styles.containerContent, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <ThemedText>{params?.params?.request.params[1]}</ThemedText>
    </View>
  )
}

export default SignTypedData
