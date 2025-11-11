import React from 'react'
import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native'

import { IsIos } from '@/constants/app'

const KeyboardAvoiding = ({ ...props }: KeyboardAvoidingViewProps) => {
  return (
    <KeyboardAvoidingView
      // keyboardVerticalOffset={IsIos ? -100 : 0}
      enabled
      behavior={IsIos ? 'padding' : 'height'}
      {...props}
      style={[{ flex: 1 }, props?.style]}
    />
  )
}

export default KeyboardAvoiding
