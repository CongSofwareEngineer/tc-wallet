import { useRouter } from 'expo-router'
import { useEffect } from 'react'

import { setRequestWC } from '@/redux/slices/requestWC'
import { store } from '@/redux/store'
import { sleep } from '@/utils/functions'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

import useRequestWC from './useReuestWC'

const useSubscribeWC = () => {
  const { setRequest } = useRequestWC()
  const router = useRouter()

  useEffect(() => {
    let instance: TypeWalletKit | null = null

    const onSessionDelete = (e: any) => {
      try {
        const { topic } = e
        WalletKit.onSessionDelete(topic)
      } catch (error) {
        console.error({ onSessionDelete: error })
      }
    }

    const onSessionRequest = async (e: any) => {
      try {
        if (e.params.request) {
          setRequest({
            ...(e as any),
            timestamp: Date.now(),
            type: 'request',
          })
          await sleep(300)
          router.push('/approve')
        }
      } catch (error) {
        console.error({ onSessionRequest: error })
      }
    }

    const onSessionProposal = async (e: any) => {
      console.log({ onSessionProposal: e })

      store.dispatch(
        setRequestWC({
          ...(e as any),
          timestamp: Date.now(),
          type: 'proposal',
        })
      )
      setTimeout(() => {
        router.replace('/connect-account')
      }, 500)
    }

    const init = async () => {
      try {
        instance = await WalletKit.init()
        try {
          instance.off?.('session_delete', (e) => { })
          instance.off?.('session_proposal', (e) => { })
          instance.off?.('session_request', (e) => { })
          instance.off?.('session_authenticate', (e) => { })
        } catch { }
        await sleep(500)
        instance.on('session_delete', onSessionDelete)
        instance.on('session_request', onSessionRequest)
        instance.on('session_proposal', onSessionProposal)
        instance.on('session_authenticate', async (e) => {
          console.log({ session_authenticate: e })
        })

        // auto reconnect
        await WalletKit.reConnect()
      } catch (error) {
        console.error({ init: error })
      }
    }
    init()

    return () => {
      if (instance) {
        try {
          instance.off('session_delete', (e) => { })
          instance.off('session_request', (e) => { })
        } catch { }
      }
    }
  }, [router, setRequest])
}

export default useSubscribeWC
