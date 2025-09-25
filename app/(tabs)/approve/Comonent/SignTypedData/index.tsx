import React from 'react'
import { ScrollView, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'

import styles from '../../styles'

const SignTypedData = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.containerContent, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <ScrollView>
        <ThemedText>{params?.params?.request.params[1]}</ThemedText>
      </ScrollView>
    </View>
  )
}

export default SignTypedData
