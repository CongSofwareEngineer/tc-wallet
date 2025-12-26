import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { getSdkError } from '@walletconnect/utils'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { CHAIN_DEFAULT } from '@/constants/chain'
import useLanguage from '@/hooks/useLanguage'
import useRequestWC from '@/hooks/useReuestWC'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { ellipsisText, sleep } from '@/utils/functions'
import WalletKit from '@/utils/walletKit'

import styles from './styles'

const ConnectAccountScreen = () => {
  const [isPending, setIsPending] = useState(false)

  const { requestWC, removeRequest } = useRequestWC()
  const { wallet } = useWallets()
  const { text } = useTheme()
  const { translate } = useLanguage()
  const router = useRouter()

  const request = useMemo(() => {
    return requestWC[0]
  }, [requestWC])


  const listChains = useMemo(() => {
    if (!request) return []
    const { requiredNamespaces, optionalNamespaces } = request.params || {}
    const chains: string[] = []
    Object.keys(requiredNamespaces).forEach((key) => {
      const namespace = requiredNamespaces[key]
      if (namespace.chains && namespace.chains.length > 0) {
        chains.push(...namespace.chains)
      }
    })

    Object.keys(optionalNamespaces).forEach((key) => {
      const namespace = optionalNamespaces[key]
      if (namespace.chains && namespace.chains.length > 0) {
        chains.push(...namespace.chains)
      }
    })
    return chains.map((chain) => chain.split(':')[1])
  }, [request])

  const handleReject = async () => {
    try {
      const walletKit = await WalletKit.init()
      await walletKit.rejectSession({
        id: request?.id,
        reason: getSdkError('USER_REJECTED'),
      })
      await sleep(500)
      removeRequest(request?.id)
      router.replace('/(tabs)/home')
    } catch (error) {
      console.error(error)
    }
  }

  const handleConnect = async () => {
    try {
      if (!wallet) return
      setIsPending(true)
      const { id, params } = request || {}
      const nameSpaces = WalletKit.formatNameSpaceBySessions(params as any, wallet?.address || '')

      await WalletKit.onSessionProposal(id, params, nameSpaces)
      await sleep(500)

      router.replace('/(tabs)/home')
      await sleep(500)
      removeRequest(request.id)
      setIsPending(false)
    } catch (error) {
      setIsPending(false)
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      {request && (
        <>
          <ThemedText style={{ marginBottom: 10 }} type='subtitle'>
            Kết nối Dapp
          </ThemedText>

          <Image style={{ width: 50, height: 50 }} source={{ uri: request.params.proposer.metadata.icons[0] }} />
          {request?.verifyContext?.verified?.validation === 'VALID' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#4CAF50',
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <MaterialIcons name='verified' size={12} color='#FFFFFF' />
              <ThemedText type='small'>Verified</ThemedText>
            </View>
          )}
          <ThemedText type='subtitle'>{request.params.proposer.metadata.name}</ThemedText>
          <ThemedText style={[text.size_12]}>{request.params.proposer.metadata.url}</ThemedText>

          <View style={{ width: '100%', flex: 1 }}>
            {listChains.length > 0 && (
              <FlatList
                contentContainerStyle={{ gap: 20 }}
                data={listChains}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const chainInfo = CHAIN_DEFAULT.find((c) => c.id === Number(item))
                  return (
                    <View style={styles.containerItem}>
                      <View>
                        <Image
                          style={{ width: 40, height: 40, borderRadius: 50 }}
                          source={{ uri: chainInfo?.iconChain || request.params.proposer.metadata.icons[0] }}
                        />
                      </View>

                      <View>
                        <ThemedText>{chainInfo?.name || item}</ThemedText>
                        <ThemedText>{ellipsisText(wallet?.address, 6, 8)}</ThemedText>
                      </View>
                    </View>
                  )
                }}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 20, paddingBottom: 10, paddingTop: 10 }}>
            <ThemeTouchableOpacity type='outline' disabled={isPending} onPress={handleReject} style={{ flex: 1 }}>
              <ThemedText style={{ textAlign: 'center' }}>{translate('common.reject')} </ThemedText>
            </ThemeTouchableOpacity>
            <ThemeTouchableOpacity loading={isPending} style={{ flex: 1 }} onPress={handleConnect}>
              <ThemedText style={{ textAlign: 'center' }}>{translate('common.approve')}</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default ConnectAccountScreen
