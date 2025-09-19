import React from 'react'
import { StyleSheet, Switch, SwitchProps } from 'react-native'

import { MODE } from '@/constants/style'
import useMode from '@/hooks/useMode'

const ThemeSwitch = (props: SwitchProps) => {
  const { mode } = useMode()
  return <Switch {...props} style={[styles[mode]]} />
}

const styles = StyleSheet.create({
  [MODE.Dark]: {
    // backgroundColor: '#fff',
  },
  [MODE.Light]: {},
})

export default ThemeSwitch
