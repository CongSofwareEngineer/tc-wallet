import 'react-native-get-random-values'
//
import '@walletconnect/react-native-compat'
import 'fast-text-encoding'

///
import { WalletKit as WalletKitCore, WalletKitTypes } from '@reown/walletkit'
import { WalletKit as TypeWallet } from '@reown/walletkit/dist/types/client'
import { Core } from '@walletconnect/core'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

import { setSessions } from '@/redux/slices/sessionsSlice'
import { store } from '@/redux/store'
import { EIPNamespaces, Params, Session, Sessions } from '@/types/walletConnect'

import { cloneDeep } from '../functions'
import WalletEvmUtil from '../walletEvm'

export type TypeWalletKit = TypeWallet
let walletKit: TypeWalletKit
let initializing: Promise<TypeWalletKit> | null = null
const subscribedTopics = new Set<string>()

const WalletKit = {
  init: async () => {
    if (walletKit) return walletKit
    if (initializing) return initializing
    initializing = (async () => {
      const core = new Core({
        projectId: '40c7fbd30534a24b3a0c2c92a757a76b',
      })
      const instance = await WalletKitCore.init({
        core,
        metadata: {
          name: 'Demo React Native Wallet',
          description: 'Demo RN Wallet to interface with Dapps',
          url: 'www.walletconnect.com',
          icons: ['https://your_wallet_icon.png'],
          redirect: { native: 'yourwalletscheme://' },
        },
      })
      try {
        // @ts-ignore internal emitter; lift listener cap
        instance.core.relayer.events.setMaxListeners?.(50)
        instance.events.setMaxListeners?.(50)
      } catch { }
      walletKit = instance
      initializing = null
      return walletKit
    })()
    return initializing
  },
  safeSubscribe: async (topic: string) => {
    if (!topic) return
    if (!walletKit) return
    if (subscribedTopics.has(topic)) return
    try {
      await walletKit.core.relayer.subscribe(topic)

      subscribedTopics.add(topic)
    } catch (e) {
      console.log({ errorsafeSubscribe: e })
    }
  },

  safeUnsubscribe: async (topic: string) => {
    if (!topic || !walletKit) return
    try {
      await walletKit.core.relayer.unsubscribe(topic)
    } catch (e) {
      console.log({ errorUnsubscribe: e })
    }
    subscribedTopics.delete(topic)
  },

  reConnect: async () => {
    try {
      const instance = await WalletKit.init()
      const sessionsActive = instance.getActiveSessions()
      const sessionValid: Sessions = {}
      if (sessionsActive) {
        for (const key of Object.keys(sessionsActive)) {
          const s = sessionsActive[key]
          await WalletKit.safeSubscribe(s.topic)
          sessionValid[key] = s
        }
      }
      const pairings = instance.core.pairing.getPairings()
      for (const pair of pairings) {
        await WalletKit.safeSubscribe(pair.topic)
      }
      store.dispatch(setSessions({ ...sessionValid }))
    } catch (e) {
      void e
    }
  },

  formatNameSpaceBySessions: (sessions: Session, address: string): EIPNamespaces => {
    const epi: EIPNamespaces = {}
    Object.entries(sessions.optionalNamespaces).forEach(([key, value]) => {
      const accounts: string[] = []
      value.chains?.forEach((chain) => {
        accounts.push(`${chain}:${address}`)
      })
      epi[key] = {
        accounts,
        methods: value.methods || [],
        events: value.events || [],
        chains: value.chains || [],
      }
    })
    return epi
  },
  buildApprovedNamespaces: (params: Params, eipNamespaces: EIPNamespaces) => {
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params as any,
      supportedNamespaces: eipNamespaces,
    })
    return approvedNamespaces
  },
  onSessionProposal: async (id: WalletKitTypes.SessionProposal['id'], params: Params, eipNamespaces: EIPNamespaces) => {
    try {
      const instance = await WalletKit.init()
      const approvedNamespaces = WalletKit.buildApprovedNamespaces(params, eipNamespaces)

      const session = await instance.approveSession({
        id,
        namespaces: approvedNamespaces,
      })
      const sessions = cloneDeep<Sessions>(store.getState().sessions)
      sessions[session.topic] = session
      // Ensure we are subscribed to the new session's topic so that encryption keys are established
      try {
        await WalletKit.safeSubscribe(session.topic)
      } catch { }
      store.dispatch(setSessions({ ...sessions }))
    } catch {
      await walletKit.rejectSession({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      })
    }
  },
  onSessionDelete: async (topic: string) => {
    try {
      const sessions = cloneDeep<Sessions>(store.getState().sessions)
      if (sessions[topic]) {
        delete sessions[topic]
      }
      store.dispatch(setSessions({ ...sessions }))

      await WalletKit.init()
      await WalletKit.safeUnsubscribe(topic)
    } catch (e) {
      void e
    }
  },
  disconnectSession: async (topic: string) => {
    try {
      const walletKit = await WalletKit.init()
      await walletKit.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
    } catch { }
  },

  sessionDeleteAll: async () => {
    try {
      const instance = await WalletKit.init()
      const sessions = instance.getActiveSessions()
      for (const key in sessions) {
        const t = sessions[key].topic
        try {
          await instance.disconnectSession({ topic: t, reason: getSdkError('USER_DISCONNECTED') })
        } catch { }
        await WalletKit.safeUnsubscribe(t)
      }
      store.dispatch(setSessions({}))
    } catch { }
  },
  onApproveRequest: async (id: number, topic: string, params: Params) => {
    try {
      if (params?.chainId?.includes('eip155')) {
        const result = await WalletEvmUtil.approveRequest(id, topic, params)
        // result returned from approveRequest
        await WalletKit.respondSessionRequest(id, topic, result)
      }
    } catch (error) {
      await WalletKit.respondSessionRequest(id, topic, error, true)
    }
  },
  respondSessionRequest: async (id: number, topic: string, response: any, isError: boolean = false) => {
    try {
      const instance = walletKit || (await WalletKit.init())
      // Validate session/topic exists before responding to avoid core.crypto.encode() failures
      const activeSessions = instance.getActiveSessions?.() || {}
      if (!activeSessions[topic]) {
        // If session missing, surface a structured error
        await instance.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: { code: -32001, message: 'Session not found for topic' },
          },
        })
        return
      }
      // Defensive subscribe (no-op if already) to ensure relayer key negotiation completed
      try {
        await WalletKit.safeSubscribe(topic)
      } catch { }

      if (isError) {
        await instance.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: { code: -32000, message: (response as Error)?.message || 'Unknown error' },
          },
        })
      } else {
        await instance.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            result: response,
          },
        })
      }
    } catch (e) {
      // Fallback: last-attempt error payload if even responding failed
      try {
        if (walletKit) {
          await walletKit.respondSessionRequest({
            topic,
            response: {
              id,
              jsonrpc: '2.0',
              error: { code: -32002, message: (e as Error).message || 'Failed to respond' },
            },
          })
        }
      } catch { }
    }
  },
}

export default WalletKit
