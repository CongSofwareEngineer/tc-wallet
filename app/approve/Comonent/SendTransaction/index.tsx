import AntDesign from '@expo/vector-icons/AntDesign'
import Big from 'bignumber.js'
import React, { useMemo, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Address, Hex, decodeFunctionData, erc20Abi, isHex } from 'viem'

import ThemedText from '@/components/UI/ThemedText'
import useAlertHook from '@/hooks/useAlert'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'
import { Clipboard } from '@/utils/clipboard'
import { ellipsisText } from '@/utils/functions'

const SendTransaction = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()
  const { chainCurrent } = useChains()
  const styles = createLocalStyles(colors)
  const { showSuccess, showError } = useAlertHook()
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

  const asString = (v: any) => (v == null ? '—' : String(v))
  const toWeiString = (v: any) => {
    if (v == null) return null
    if (typeof v === 'bigint') return v.toString()
    if (typeof v === 'number') return Math.trunc(v).toString()
    if (typeof v === 'string') return v
    return null
  }

  const toEth = (wei?: string | null) => {
    try {
      if (!wei) return '—'
      const n = isHex(wei) ? Big(parseInt(wei, 16)) : Big(wei)
      return n.dividedBy(Big(10).pow(18)).toFixed()
    } catch {
      return '—'
    }
  }

  const toGwei = (wei?: string | null) => {
    try {
      if (!wei) return '—'
      const n = isHex(wei) ? Big(parseInt(wei, 16)) : Big(wei)
      return n.dividedBy(1e9).toFixed()
    } catch {
      return '—'
    }
  }

  const dataInfo = useMemo(() => {
    const data = tx?.data as string | undefined
    if (!data || typeof data !== 'string' || data.length < 4) return null
    try {
      const decoded = decodeFunctionData({ abi: erc20Abi, data: data as Hex })
      return decoded
    } catch {
      return null
    }
  }, [tx])

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

  if (!tx) {
    return (
      <View style={[styles.container, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
        <ThemedText>Unable to parse transaction</ThemedText>
      </View>
    )
  }

  const valueWei = toWeiString(tx.value)
  const gasWei = toWeiString(tx.gas)
  const gasPriceWei = toWeiString(tx.gasPrice)
  const maxFeePerGasWei = toWeiString(tx.maxFeePerGas)
  const maxPriorityFeePerGasWei = toWeiString(tx.maxPriorityFeePerGas)

  return (
    <View style={[styles.container, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!chainCurrent?.iconChain && <Image source={{ uri: chainCurrent.iconChain }} style={styles.chainIcon} />}
          <ThemedText style={styles.headerTitle}>Send Transaction</ThemedText>
        </View>
        {!!tx?.nonce && (
          <View style={styles.chip}>
            <ThemedText style={styles.chipText}>Nonce: {asString(tx.nonce)}</ThemedText>
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
                    await Clipboard.setStringAsync(String(tx.from))
                    showSuccess('Copied from address')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AntDesign name='copy' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
            {!!tx.to && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(String(tx.to))
                    showSuccess('Copied to address')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AntDesign name='copy' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
            {!!valueWei && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(`${toEth(valueWei)} ${chainCurrent?.nativeCurrency?.symbol || 'ETH'}`)
                    showSuccess('Copied value')
                  } catch {
                    showError('Copy failed')
                  }
                }}
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AntDesign name='copy' size={16} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
          </View>
        }
      >
        <Row label='From' value={ellipsisText(asString(tx.from), 6, 6)} />
        <Row label='To' value={ellipsisText(asString(tx.to), 6, 6)} />
        <Row label='Value' value={`${toEth(valueWei)} ${chainCurrent?.nativeCurrency?.symbol || 'ETH'}`} />
      </Section>

      <Section title='Fees'>
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

      <Section
        title='Data'
        right={
          !!tx.data && (
            <TouchableOpacity
              onPress={async () => {
                try {
                  await Clipboard.setStringAsync(String(tx.data))
                  showSuccess('Copied data to clipboard')
                } catch {
                  showError('Copy failed')
                }
              }}
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AntDesign name='copy' size={16} color={secondaryTextColor} />
            </TouchableOpacity>
          )
        }
      >
        {!tx.data ? (
          <ThemedText style={styles.muted}>No input data</ThemedText>
        ) : (
          <>
            {dataInfo ? (
              <>
                <Row label='Function' value={String(dataInfo.functionName)} />
                {dataInfo.functionName === 'transfer' && (
                  <>
                    <Row label='Token' value={ellipsisText(asString(tx.to), 6, 6)} />
                    <Row
                      label='Amount'
                      value={(() => {
                        try {
                          const [, amount] = dataInfo.args as [Address, bigint]
                          return Big(amount.toString()).dividedBy(Big(10).pow(18)).toFixed()
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

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
    <ThemedText style={{ color: '#A0A0A0' }}>{label}</ThemedText>
    <ThemedText style={{ marginLeft: 16 }}>{value}</ThemedText>
  </View>
)

export default SendTransaction

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
    },
    chainIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingHorizontal: 6,
    },
    headerTitle: {
      fontSize: 16,
      color: colors.text || '#FFFFFF',
      fontWeight: '700',
    },
    chip: {
      backgroundColor: colors.black2 || 'rgba(255,255,255,0.08)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    chipText: {
      fontSize: 12,
      color: colors.textSecondary || '#A0A0A0',
      fontWeight: '600',
    },
    sectionBox: {
      backgroundColor: colors.black2 || '#1C1C1E',
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border || 'rgba(255,255,255,0.08)',
      marginBottom: 10,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    sectionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text || '#FFFFFF',
      marginBottom: 0,
    },
    sectionChevron: {
      marginRight: 8,
    },
    sectionContent: {
      marginTop: 8,
    },
    code: {
      fontFamily: 'Courier',
      fontSize: 12,
      lineHeight: 18,
      color: colors.text || '#FFFFFF',
    },
    muted: {
      color: colors.textSecondary || '#A0A0A0',
    },
    iconButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: 'transparent',
    },
  })
