import React, { useMemo, useState } from 'react'

import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT } from '@/constants/style'
import useDecodeTx from '@/hooks/react-query/useDecodeTx'
import { copyToClipboard } from '@/utils/functions'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import BigNumber from 'bignumber.js'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { hexToNumber } from 'viem'
import createLocalStyles from './styles'

const Section = ({
  title,
  children,
  right,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  right?: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultOpen)

  const { colors } = useTheme()
  const styles = createLocalStyles(colors)
  const secondaryTextColor = (colors as any).textSecondary || '#A0A0A0'

  return (
    <View style={styles.sectionBox}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded((v) => !v)} style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <AntDesign name={expanded ? 'up' : 'down'} size={14} color={secondaryTextColor} style={styles.sectionChevron} />
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        </View>
        {!!right && <View>{right}</View>}
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  )
}

const Row = ({ label, value }: { label: string; value: any }) => {
  const valueFormatted = useMemo(() => {
    if (value.hex) {
      return BigNumber(hexToNumber(value)).toFormat()
    }
    return value?.toString()
  }, [value])

  return (
    <View style={{ gap: GAP_DEFAULT.Gap4 }}>
      <ThemedText style={{ textTransform: 'capitalize', fontWeight: '600' }}>{label}:</ThemedText>
      <ThemedText type='small' style={{ opacity: 0.5 }}>
        {valueFormatted}{' '}
        <Ionicons
          name='copy-outline'
          size={12}
          color='#A0A0A0'
          onPress={() => {
            copyToClipboard(valueFormatted, true)
          }}
        />
        <View style={{ width: '100%' }} />
      </ThemedText>
    </View>
  )
}

const SendTransaction = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()
  const styles = createLocalStyles(colors)

  const chainIdRequest = useMemo(() => {
    let chainId = params?.params?.chainId
    chainId = chainId.replace('eip155:', '')
    return Number(chainId)
  }, [params])

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

  const { data, isLoading } = useDecodeTx(chainIdRequest, tx?.to || '', tx?.data || '')

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: colors.black3, padding: 12, borderRadius: 12, gap: GAP_DEFAULT.Gap8 }]}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText style={styles.headerTitle}>Method</ThemedText>
          </View>
          <ThemedText style={[styles.headerTitle, { textTransform: 'capitalize' }]}>{data?.method}</ThemedText>
        </View>
        <Section title='Params' defaultOpen>
          {isLoading && (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <MyLoading />
            </View>
          )}

          {data?.inputs && data?.names && (
            <>
              {data.names.map((input: any, index: number) => {
                return <Row key={input + index} label={input} value={data.inputs[index]} />
              })}
            </>
          )}
        </Section>
      </View>
    </ScrollView>
  )
}

export default SendTransaction
