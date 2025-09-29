import { getSdkError } from '@walletconnect/utils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useTransition } from 'react'
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
  const [isPending, startTransition] = useTransition()
  const { requestWC, removeRequest } = useRequestWC()
  const { wallet } = useWallets()
  const { text } = useTheme()
  const { translate } = useLanguage()
  const router = useRouter()
  const query = useLocalSearchParams()
  console.log({ query })

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
    const walletKit = await WalletKit.init()
    await walletKit.rejectSession({
      id: request?.id,
      reason: getSdkError('USER_REJECTED'),
    })
    await sleep(500)
    removeRequest(request?.id)
    router.replace('/home')
  }

  const handleConnect = async () => {
    startTransition(async () => {
      const { id, params } = request || {}
      const nameSpaces = WalletKit.formatNameSpaceBySessions(params as any, wallet?.address || '')

      await WalletKit.onSessionProposal(id, params, nameSpaces)
      await sleep(500)

      router.replace('/home')
      await sleep(500)
      removeRequest(request.id)
    })
  }

  return (
    <View style={styles.container}>
      {request && (
        <>
          <ThemedText type='subtitle'>Kết nối Dapp</ThemedText>
          <Image style={{ width: 50, height: 50 }} source={{ uri: request.params.proposer.metadata.icons[0] }} />
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
            <ThemeTouchableOpacity disabled={isPending} onPress={handleReject} style={{ flex: 1 }}>
              <ThemedText>{translate('common.reject')} </ThemedText>
            </ThemeTouchableOpacity>
            <ThemeTouchableOpacity loading={isPending} style={{ flex: 1 }} onPress={handleConnect}>
              <ThemedText>{translate('common.approve')}</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default ConnectAccountScreen
