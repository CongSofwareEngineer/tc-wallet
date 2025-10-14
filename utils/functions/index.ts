import * as Clipboard from 'expo-clipboard'
import { Alert } from 'react-native'
import { formatUnits } from 'viem'

import { IsIos } from '@/constants/app'
import { openAlert } from '@/redux/slices/alertSlice'
import { store } from '@/redux/store'

export const cloneDeep = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const lowercase = (val: string | null | undefined) => {
  return val ? val.toLowerCase() : val
}

export const uppercase = (val: string | null | undefined) => {
  return val ? val.toUpperCase() : val
}

export const capitalize = (val: string | null | undefined) => {
  if (!val || val.length === 0) return ''
  return val.charAt(0).toUpperCase() + val.slice(1)
}

export const numberWithCommas = (num: number | string | bigint | null | undefined) => {
  if (num === null || num === undefined) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const copyToClipboard = async (text: string, duration: number = 2000, type: 'text' | 'url' | 'image' = 'text') => {
  if (IsIos) {
    Alert.alert(text, text)
  } else {
    store.dispatch(openAlert({ text: 'Copied', duration }))
  }

  if (type === 'text') {
    await Clipboard.setStringAsync(text)
    return
  }
  if (type === 'url') {
    if (IsIos) {
      await Clipboard.setUrlAsync(text)
    } else {
      await Clipboard.setStringAsync(text)
    }
    return
  }
  if (type === 'image') {
    await Clipboard.setImageAsync(text)
    return
  }
}

export const ellipsisText = (text?: string, prefixLength = 13, suffixLength = 4): string => {
  text = text || ''
  return `${text.substr(0, prefixLength)}...${text.substr(text.length - suffixLength, suffixLength)}`
}

export const getRadomColor = (seed: string = 'default') => {
  try {
    // Simple hash to color
    let hash = 0
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    const c = (hash & 0x00ffffff).toString(16).toUpperCase()
    return '#' + '00000'.substring(0, 6 - c.length) + c
  } catch (error) {
    return '#000000'
  }
}

export const convertWeiToBalance = (wei: string | number | bigint | null | undefined, decimals = 18): string => {
  if (wei === null || wei === undefined) return ''
  return formatUnits(BigInt(wei), decimals)
}
export const convertBalanceToWei = (balance: string | number | bigint | null | undefined, decimals = 18): string => {
  if (balance === null || balance === undefined) return ''
  return formatUnits(BigInt(balance), decimals)
}
