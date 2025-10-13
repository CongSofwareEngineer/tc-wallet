import React, { useMemo } from 'react'

import { CODE_FUNCTION } from '@/constants/walletConncet'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'
import { lowercase } from '@/utils/functions'

import TxCustom from './Component/TxCustom'
import TxDefault from './Component/TxDefault'

const SendTransaction = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()

  const tx = useMemo(() => {
    const raw = params?.params?.request?.params?.[0]
    if (!raw) return null
    if (typeof raw === 'object') return raw
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [params])

  const isDefault = useMemo(() => {
    return Object.keys(CODE_FUNCTION).some((key) => {
      if (!tx?.data) {
        return false
      }
      const hexFunc = lowercase(`0x${tx.data.slice(2, 10)}`)
      return key?.includes(hexFunc!) || hexFunc?.includes(key)
    })
  }, [tx])
  console.log({ isDefault })

  return isDefault ? <TxDefault params={params} /> : <TxCustom />
  // return <ThemedText>{isDefault ? 'Default Transaction' : 'Custom Transaction'}</ThemedText>
}

export default SendTransaction
