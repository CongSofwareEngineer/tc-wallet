import * as Clipboard from 'expo-clipboard'
import { formatUnits, parseUnits } from 'viem'

import { images } from '@/configs/images'
import { IsAndroid, IsIos } from '@/constants/app'
import { openAlert } from '@/redux/slices/alertSlice'
import { store } from '@/redux/store'
import { ActivityAction, startActivityAsync } from 'expo-intent-launcher'
import * as Linking from 'expo-linking'

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
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const copyToClipboard = async (text: string, isEx = false, duration: number = 1000, type: 'text' | 'url' | 'image' = 'text') => {
  store.dispatch(openAlert({ text: 'Copied', duration, isEx }))

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
  return parseUnits(balance.toString(), decimals).toString()
}

export const detectUrlImage = (src: string | null | undefined) => {
  if (!src) return images.icons.unknown
  if (src?.startsWith('https://')) {
    const imageUrl = new URL(src)
    const imgQuery = imageUrl.searchParams.get('image')

    if (imgQuery && imgQuery.startsWith('https://')) {
      src = imgQuery
    }
  }

  if (src?.startsWith('https://')) {
    return src
  }
  if (src?.startsWith('ipfs://')) {
    return src.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  return src
}

export const isLink = (str: string) => {
  if (!str) return false
  str = str?.toString()?.trim()

  // Sử dụng biểu thức chính quy để kiểm tra
  const pattern = /^(http|https|ftp):\/\/[^\s/$.?#].[^\s]*$/

  return pattern.test(str)
}

export const isObject = (data: any, checkEmpty = false) => {
  const isObj = data && typeof data === 'object'

  return checkEmpty ? isObj && Object.keys(data).length > 0 : isObj
}

export const formatCustomTimestamp = () => {
  const now = new Date()

  const year = now.getUTCFullYear()
  // Tháng trong JS bắt đầu từ 0 nên phải +1
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')

  const hours = String(now.getUTCHours()).padStart(2, '0')
  const mins = String(now.getUTCMinutes()).padStart(2, '0')
  const secs = String(now.getUTCSeconds()).padStart(2, '0')
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0')

  // Nối chuỗi theo cấu trúc: YYYY_MM_DD__THH_mm_ss_msz
  return `${year}_${month}_${day}__T${hours}_${mins}_${secs}_${ms}z`
}

export const openSetting = async (type: ActivityAction = ActivityAction.SETTINGS) => {
  if (IsIos) {
    await Linking.openSettings()
  }
  if (IsAndroid) {
    await startActivityAsync(type)
  }
}
