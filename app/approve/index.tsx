import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import ThemedText from '@/components/UI/ThemedText'
import useLanguage from '@/hooks/useLanguage'
import useRequestWC from '@/hooks/useReuestWC'
import { useAppSelector } from '@/redux/hooks'
import { sleep } from '@/utils/functions'

import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useCollections from '@/hooks/react-query/useCollections'
import useListNFTs from '@/hooks/react-query/useListNFTs'
import CurrentSession from './Comonent/CurrentSession'
import PersonalSign from './Comonent/Personalsign'
import SendTransaction from './Comonent/SendTransaction'
import SignTypedData from './Comonent/SignTypedData'

const ApproveScreen = () => {
  const [isApproving, setApproving] = useState(false)
  const [isRejecting, setRejecting] = useState(false)
  const { translate } = useLanguage()
  const sessions = useAppSelector((state) => state.sessions)
  const { requestWC, removeRequest } = useRequestWC()
  const router = useRouter()
  const { refetch: refetchBalance } = useBalanceToken()
  const { refetch: refetchCollections } = useCollections()
  const { refetch: refetchNFTs } = useListNFTs()

  const requestLasted = useMemo(() => {
    if (requestWC[requestWC.length - 1]) {
      if (requestWC[requestWC.length - 1]?.params?.request) {
        return requestWC[requestWC.length - 1]
      }
    }
    return null
  }, [requestWC])

  const currentSession = useMemo(() => {
    if (requestLasted) {
      return sessions[requestLasted.topic]
    }
    return null
  }, [requestLasted, sessions])

  const handleReject = async () => {
    try {
      setRejecting(true)
      if (requestLasted?.id) {
        const WalletKit = await import('@/utils/walletKit').then((mod) => mod.default)
        await WalletKit.respondSessionRequest(requestLasted.id, requestLasted.topic, 'USER_REJECTED', true)
        await sleep(500)
        removeRequest(requestLasted.id)
      }
    } catch {
    } finally {
      setRejecting(false)
      router.dismissAll()
    }
  }

  const handleApprove = async () => {
    try {
      setApproving(true)
      const method = requestLasted?.params?.request?.method

      if (requestLasted?.id) {
        const WalletKit = await import('@/utils/walletKit').then((mod) => mod.default)

        const { id, params, topic } = requestLasted
        WalletKit.onApproveRequest(id, topic, params as any)
        if ('eth_sendTransaction' === method) {
          await Promise.all([refetchBalance(), refetchCollections(), refetchNFTs()])
        }
        await sleep(500)
        removeRequest(requestLasted.id)
      }
    } catch {
    } finally {
      setApproving(false)
      router.dismissAll()
    }
  }

  const renderNoData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>No data available</ThemedText>
      </View>
    )
  }

  const renderRequest = () => {
    const method = requestLasted?.params?.request?.method

    if (method) {
      switch (method) {
        case 'personal_sign':
          return <PersonalSign params={requestLasted} />

        case 'eth_signTypedData':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData_v3':
          return <SignTypedData params={requestLasted} />
        case 'eth_sendTransaction':
          return <SendTransaction params={requestLasted} />
        default:
          return <ThemedText>Not support {method}</ThemedText>
      }
    }
    return <></>
  }

  return (
    <View style={styles.overlay}>
      {requestLasted && currentSession?.peer ? (
        <>
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            <CurrentSession params={requestLasted} session={currentSession!} />
            {renderRequest()}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 20, paddingBottom: 10, paddingTop: 10 }}>
            <ThemeTouchableOpacity type='outline' disabled={isApproving} loading={isRejecting} onPress={handleReject} style={{ flex: 1 }}>
              <ThemedText style={{ textAlign: 'center' }}>{translate('common.reject')} </ThemedText>
            </ThemeTouchableOpacity>
            <ThemeTouchableOpacity loading={isApproving} disabled={isRejecting} style={{ flex: 1 }} onPress={handleApprove}>
              <ThemedText style={{ textAlign: 'center' }}>{translate('common.approve')}</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        </>
      ) : (
        renderNoData()
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
})

export default ApproveScreen
