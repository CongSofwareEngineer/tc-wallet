import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useMemo, useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import { RequestWC } from '@/redux/slices/requestWC'
import { copyToClipboard } from '@/utils/functions'

import styles from '../../styles'

const SignTypedData = ({ params }: { params: RequestWC }) => {
  const { colors } = useTheme()
  const { chainList, chainCurrent } = useChains()
  const primaryColor = (colors as any)?.primary || '#4CAF50'
  const textSecondary = (colors as any)?.textSecondary || '#A0A0A0'
  const rawTypedData = params?.params?.request?.params?.[1]

  const typedData = useMemo(() => {
    if (!rawTypedData) return null
    if (typeof rawTypedData === 'object') return rawTypedData
    // Try to parse stringified EIP-712 typed data
    try {
      return JSON.parse(rawTypedData as unknown as string)
    } catch {
      return null
    }
  }, [rawTypedData])

  const domain = typedData?.domain
  const message = typedData?.message
  const types = typedData?.types
  const primaryType = typedData?.primaryType

  const sectionStyles = createLocalStyles(colors)

  // Resolve chain by EIP-712 domain.chainId when available; fallback to current selected chain
  const resolvedChain = useMemo(() => {
    const domainChainIdRaw = (typedData as any)?.domain?.chainId
    if (domainChainIdRaw == null) return chainCurrent
    let idStr: string | undefined
    if (typeof domainChainIdRaw === 'string') {
      idStr = domainChainIdRaw.startsWith('0x') ? parseInt(domainChainIdRaw, 16).toString() : domainChainIdRaw
    } else if (typeof domainChainIdRaw === 'number' || typeof domainChainIdRaw === 'bigint') {
      idStr = Number(domainChainIdRaw).toString()
    }
    const found = chainList?.find?.((c: any) => c?.id?.toString() === idStr)
    return found || chainCurrent
  }, [typedData, chainList, chainCurrent])

  const Section = ({
    title,
    subtitle,
    children,
    initiallyOpen = false,
    onCopy,
  }: {
    title: string
    subtitle?: string
    children: React.ReactNode
    initiallyOpen?: boolean
    onCopy?: () => void
  }) => {
    const [open, setOpen] = useState(initiallyOpen)
    return (
      <View style={sectionStyles.sectionBox}>
        <TouchableOpacity style={sectionStyles.sectionHeader} onPress={() => setOpen((o) => !o)}>
          <View style={{ flex: 1 }}>
            <ThemedText style={sectionStyles.sectionTitle}>{title}</ThemedText>
            {!!subtitle && <ThemedText style={sectionStyles.sectionSubtitle}>{subtitle}</ThemedText>}
          </View>
          {onCopy && (
            <TouchableOpacity onPress={onCopy} style={sectionStyles.iconButton}>
              <AntDesign name='copy' size={16} color={primaryColor} />
            </TouchableOpacity>
          )}
          <AntDesign name='down' size={16} color={textSecondary} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }], marginLeft: 8 }} />
        </TouchableOpacity>
        {open && <View style={sectionStyles.sectionContent}>{children}</View>}
      </View>
    )
  }

  const renderJson = (value: unknown) => {
    try {
      const pretty = JSON.stringify(value, null, 2)
      return <ThemedText style={sectionStyles.code}>{pretty}</ThemedText>
    } catch {
      return <ThemedText style={sectionStyles.code}>{String(value)}</ThemedText>
    }
  }

  const handleCopy = async (value: unknown) => {
    try {
      const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      await copyToClipboard(text)
    } catch {
      // noop
    }
  }

  return (
    <View style={[styles.containerContent, { backgroundColor: colors.black3, padding: 12, borderRadius: 12 }]}>
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        {!typedData ? (
          <View style={sectionStyles.sectionBox}>
            <ThemedText style={sectionStyles.sectionSubtitle}>Unable to parse typed data</ThemedText>
            <View style={sectionStyles.sectionContent}>{renderJson(rawTypedData)}</View>
          </View>
        ) : (
          <>
            <View style={sectionStyles.headerRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!resolvedChain?.iconChain && <Image source={{ uri: resolvedChain.iconChain }} style={sectionStyles.chainIcon} />}
                <ThemedText style={sectionStyles.headerTitle}>EIP-712 Typed Data</ThemedText>
              </View>
              {primaryType && (
                <View style={sectionStyles.chip}>
                  <ThemedText style={sectionStyles.chipText}>{primaryType}</ThemedText>
                </View>
              )}
            </View>

            {domain !== undefined && (
              <Section title='Domain' subtitle='Signing domain' onCopy={() => handleCopy(domain)} initiallyOpen>
                {renderJson(domain)}
              </Section>
            )}

            {message !== undefined && (
              <Section title='Message' subtitle='Structured data' onCopy={() => handleCopy(message)} initiallyOpen>
                {renderJson(message)}
              </Section>
            )}

            {types !== undefined && (
              <Section title='Types' subtitle='Type definitions' onCopy={() => handleCopy(types)}>
                {renderJson(types)}
              </Section>
            )}

            {primaryType !== undefined && (
              <Section title='Primary Type' subtitle='Root struct name' onCopy={() => handleCopy(primaryType)}>
                <ThemedText style={sectionStyles.code}>{String(primaryType)}</ThemedText>
              </Section>
            )}

            {/* Raw fallback */}
            <Section title='Raw' subtitle='Original payload' onCopy={() => handleCopy(rawTypedData)}>
              {renderJson(rawTypedData)}
            </Section>
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default SignTypedData

const createLocalStyles = (colors: any) =>
  StyleSheet.create({
    chainIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
    },
    sectionBox: {
      backgroundColor: colors.black2 || '#1C1C1E',
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border || 'rgba(255,255,255,0.08)',
      marginBottom: 10,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text || '#FFFFFF',
    },
    sectionSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textSecondary || '#A0A0A0',
    },
    iconButton: {
      padding: 6,
      borderRadius: 8,
      marginRight: 4,
      backgroundColor: colors.black3 || 'rgba(255,255,255,0.06)',
    },
    sectionContent: {
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    code: {
      fontFamily: 'Courier',
      fontSize: 12,
      lineHeight: 18,
      color: colors.text || '#FFFFFF',
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
  })
