import { MaterialIcons } from '@expo/vector-icons'
import { useMemo } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'

import ErrorBoundary from '@/components/ErrorBoundary'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS } from '@/constants/style'
import { NFT } from '@/services/moralis/type'
import { copyToClipboard, detectUrlImage, isLink, isObject, numberWithCommas } from '@/utils/functions'

import { styles } from '../styles'

type Props = {
  nft: NFT
}
const Traits = ({ nft }: Props) => {
  const traits = useMemo((): NFT['normalized_metadata']['attributes'] => {
    const arrFilter = nft?.normalized_metadata?.attributes?.filter((item: any) => item?.trait_type && item?.value) || []

    return arrFilter
  }, [nft])

  const checkIsNumber = (value: string) => {
    try {
      const hasNumbers = /^\d+$/.test(value + '')

      if (hasNumbers) {
        return true
      }

      return false
    } catch {
      return false
    }
  }

  const renderValue = (value: string | any[]) => {
    const isNumber = checkIsNumber(value?.toString() || '')

    if (isNumber) {
      return <ThemedText className=' justify-start text-navy text-sm font-normal leading-[21px]'>{numberWithCommas(value as any)}</ThemedText>
    }
    if (typeof value === 'string') {
      const isLinkItem = isLink(value)
      const isNumber = checkIsNumber(value as any)

      return isLinkItem ? (
        <TouchableOpacity onPress={() => Linking.openURL(value)}>
          <ThemedText type='small' style={{ color: COLORS.green600 }}>
            {value}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <ThemedText type='small' className=' justify-start text-navy text-sm font-normal leading-[21px]'>
          {isNumber ? numberWithCommas(value) : value}
        </ThemedText>
      )
    }

    if (Array.isArray(value)) {
      const arrAddress = value.filter((item: any) => item?.address)
      const arrLink = value.filter((item: any) => item?.uri && item?.type)
      const arrValueType = value.filter((item: any) => item?.trait_type && item?.value)
      const arrOther = value.filter((item: any) => !item?.uri && !item?.type && !item?.address && !item?.trait_type && !item?.value)

      return (
        <View>
          {arrAddress.map((item: any, index: number) => {
            return (
              <View key={`traits-address-${index}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemedText type='small'>{item?.address}</ThemedText>
                <MaterialIcons onPress={() => copyToClipboard(item?.address)} name='content-copy' size={16} color={COLORS.green} />
              </View>
            )
          })}
          {arrLink.map((item: any, index: number) => {
            const formatUrl = detectUrlImage(item?.uri)
            const isLinkItem = isLink(formatUrl)

            return isLinkItem ? (
              <TouchableOpacity key={`traits-link-${index}`} onPress={() => Linking.openURL(formatUrl)}>
                <ThemedText type='small' style={{ color: COLORS.green600 }}>
                  {formatUrl}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText type='small' key={`traits-link-${index}`}>
                {formatUrl}
              </ThemedText>
            )
          })}
          <ErrorBoundary>
            {arrOther.map((item: any, index: number) => {
              const isNumber = checkIsNumber(item as any)

              return (
                <ThemedText type='small' key={`traits-other-${index}`}>
                  {isNumber ? numberWithCommas(item?.toString()) : item?.toString()}
                </ThemedText>
              )
            })}
          </ErrorBoundary>
          <ErrorBoundary>
            {arrValueType.map((item: any, index: number) => {
              const isNumber = checkIsNumber(item?.value as any)

              return (
                <ThemedText type='small' key={`traits-other-${index}`}>
                  {isNumber ? numberWithCommas(item?.value?.toString()) : item?.value?.toString()}
                </ThemedText>
              )
            })}
          </ErrorBoundary>
        </View>
      )
    }

    return (
      <ErrorBoundary>
        <ThemedText type='small'>{isObject(value) ? JSON.stringify(value) : (value as any)?.toString()}</ThemedText>
      </ErrorBoundary>
    )
  }

  return traits && traits?.length > 0 ? (
    traits?.map((item, index: number) => {
      return (
        <View key={`traits-${index}`} style={styles.attributeItem}>
          <View style={styles.attributeBox}>
            <ThemedText style={styles.sectionTitle}>{item.trait_type}</ThemedText>
            {item.value && renderValue(item.value as any)}
          </View>
        </View>
      )
    })
  ) : (
    <ThemedText type='small' style={{ fontStyle: 'italic', opacity: 0.6 }}>
      No Attributes
    </ThemedText>
  )
}

export default Traits
