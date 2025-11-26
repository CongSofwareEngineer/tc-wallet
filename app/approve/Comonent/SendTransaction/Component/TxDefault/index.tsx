import { AntDesign, Ionicons } from '@expo/vector-icons'
import BigNumber from 'bignumber.js'
import { Image } from 'expo-image'
import React, { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { decodeFunctionData, erc20Abi, Hex } from 'viem'

import ThemedText from '@/components/UI/ThemedText'
import useFunctionNameDecode from '@/hooks/react-query/useFunctionNameDecode'
import useAlert from '@/hooks/useAlert'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'
import { convertWeiToBalance, copyToClipboard, ellipsisText, lowercase } from '@/utils/functions'

import createLocalStyles from '../../styles'

const Section = ({
  title,
  children,
  right,
  defaultOpen = false,
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

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
    <ThemedText style={{ color: '#A0A0A0' }}>{label}</ThemedText>
    <ThemedText style={{ marginLeft: 16 }}>{value}</ThemedText>
  </View>
)

const TxDefault = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()
  const { chainCurrent } = useChains()
  const styles = createLocalStyles(colors)
  const { showSuccess, showError } = useAlert()
  const secondaryTextColor = (colors as any).textSecondary || '#A0A0A0'

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

  const { data: dataFunctionNameDecode } = useFunctionNameDecode(tx?.data)
  console.log({ dataFunctionNameDecode })

  const dataInfo = useMemo(() => {
    const data = tx?.data as string | undefined
    if (!data || typeof data !== 'string' || data.length < 4) return null
    try {
      const hexFunc = lowercase(`0x${data.slice(2, 10)}`)
      console.log({ hexFunc })

      // if(hexFunc===CODE_FUNCTION[599290589]){

      // }

      const decoded = decodeFunctionData({ abi: erc20Abi, data: data as Hex })
      console.log({ decoded })

      return decoded
    } catch {
      return null
    }
  }, [tx])
  console.log({ dataInfo })

  return (
    <View style={[styles.container, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!chainCurrent?.iconChain && <Image source={{ uri: chainCurrent.iconChain }} style={styles.chainIcon} />}
          <ThemedText style={styles.headerTitle}>Send Transaction</ThemedText>
        </View>
        {!!tx?.nonce && (
          <View style={styles.chip}>
            <ThemedText style={styles.chipText}>Nonce: {tx.nonce}</ThemedText>
          </View>
        )}
      </View>

      <Section
        title='Overview'
        defaultOpen
        right={
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {!!tx.from && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await copyToClipboard(tx.from)
                    showSuccess('Copied from address')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name='copy-outline' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
            {!!tx.to && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await copyToClipboard(tx.to)
                    showSuccess('Copied to address')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name='copy-outline' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
            {!!tx.value && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    // await copyToClipboard(
                    //   `${BigNumber(convertWeiToBalance(tx.value)).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()} ${chainCurrent?.nativeCurrency?.symbol || 'ETH'}`
                    // )
                    await copyToClipboard(`${tx.value} ${chainCurrent?.nativeCurrency?.symbol || 'ETH'}`)
                    showSuccess('Copied value')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name='copy-outline' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
          </View>
        }
      >
        <Row label='From' value={ellipsisText(tx.from, 6, 6)} />
        <Row label='To' value={ellipsisText(tx.to, 6, 6)} />
        <Row
          label='Value'
          value={`${BigNumber(convertWeiToBalance(tx.value || 0))
            .decimalPlaces(6, BigNumber.ROUND_DOWN)
            .toFormat()} ${chainCurrent?.nativeCurrency?.symbol || 'ETH'}`}
        />
      </Section>

      {/* <Section title='Fees'>
           {gasPriceWei ? (
             <Row label='Gas Price' value={`${toGwei(gasPriceWei)} gwei`} />
           ) : (
             <>
               <Row label='Max Fee' value={`${toGwei(maxFeePerGasWei)} gwei`} />
               <Row label='Max Priority' value={`${toGwei(maxPriorityFeePerGasWei)} gwei`} />
             </>
           )}
           <Row label='Gas Limit' value={asString(gasWei) || '—'} />
         </Section>
    */}
      <Section
        title='Data'
        right={
          !!tx.data && (
            <TouchableOpacity
              onPress={async () => {
                try {
                  await copyToClipboard(tx.data as string)
                  showSuccess('Copied data to clipboard')
                } catch {
                  showError('Copy failed')
                }
              }}
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name='copy-outline' size={16} color={secondaryTextColor} />
            </TouchableOpacity>
          )
        }
      >
        {!tx.data ? (
          <ThemedText style={styles.muted}>No input data</ThemedText>
        ) : (
          <>
            {dataInfo && dataFunctionNameDecode ? (
              <>
                <Row label='Function' value={String(dataFunctionNameDecode)} />
                {dataInfo.functionName === 'transfer' && (
                  <>
                    <Row label='Token' value={ellipsisText(tx.to, 6, 6)} />
                    <Row label='To' value={ellipsisText(dataInfo.args[0], 6, 6)} />
                    <Row
                      label='Amount'
                      value={(() => {
                        try {
                          const [, amount] = dataInfo.args
                          return convertWeiToBalance(amount) // --- IGNORE ---
                        } catch {
                          return '—'
                        }
                      })()}
                    />
                  </>
                )}
              </>
            ) : (
              <ThemedText style={styles.code}>{String(tx.data)}</ThemedText>
            )}
          </>
        )}
      </Section>
    </View>
  )
}

export default TxDefault
