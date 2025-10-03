// Web version - uses SignClient instead of WalletKit
import { SignClient } from '@walletconnect/sign-client'
import { SessionTypes } from '@walletconnect/types'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

import { setSessions } from '@/redux/slices/sessionsSlice'
import { store } from '@/redux/store'
import { EIPNamespaces, Params, Session, Sessions } from '@/types/walletConnect'

import { cloneDeep } from '../functions'
import WalletEvmUtil from '../walletEvm'

let signClient: SignClient | null = null
let initializing: Promise<SignClient> | null = null
const subscribedTopics = new Set<string>()

class WalletKit {
  static async init() {
    if (signClient) return signClient
    if (initializing) return initializing
    initializing = (async () => {
      const instance = await SignClient.init({
        projectId: '40c7fbd30534a24b3a0c2c92a757a76b',
        metadata: {
          name: 'Demo React Native Wallet',
          description: 'Demo RN Wallet to interface with Dapps',
          url: 'www.walletconnect.com',
          icons: ['https://your_wallet_icon.png'],
        },
      })

      try {
        // @ts-ignore internal emitter; lift listener cap
        instance.events.setMaxListeners?.(50)
      } catch {
        // Ignore errors
      }
      signClient = instance
      initializing = null
      return signClient
    })()
    return initializing
  }

  static async safeSubscribe(topic: string) {
    if (!topic) return
    if (!signClient) return
    if (subscribedTopics.has(topic)) return
    try {
      await signClient.core.relayer.subscribe(topic)
      subscribedTopics.add(topic)
    } catch {
      // Log subscription error if needed
    }
  }

  static async safeUnsubscribe(topic: string) {
    if (!topic || !signClient) return
    try {
      await signClient.core.relayer.unsubscribe(topic)
    } catch {
      // Log unsubscribe error if needed
    }
    subscribedTopics.delete(topic)
  }

  static async reConnect() {
    try {
      const instance = await WalletKit.init()
      const sessionsActive = instance.session.getAll().reduce((acc: Sessions, session: SessionTypes.Struct) => {
        acc[session.topic] = session as Session
        return acc
      }, {})
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
  }

  static formatNameSpaceBySessions(sessions: Session, address: string): EIPNamespaces {
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
  }

  static buildApprovedNamespaces(params: Params, eipNamespaces: EIPNamespaces) {
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params as any,
      supportedNamespaces: eipNamespaces,
    })
    return approvedNamespaces
  }

  static async onSessionProposal(id: number, params: Params, eipNamespaces: EIPNamespaces) {
    try {
      const instance = await WalletKit.init()
      const approvedNamespaces = WalletKit.buildApprovedNamespaces(params, eipNamespaces)

      const session = await instance.approve({
        id,
        namespaces: approvedNamespaces,
      })
      const sessions = cloneDeep<Sessions>(store.getState().sessions)
      sessions[session.topic] = session as Session
      // Ensure we are subscribed to the new session's topic so that encryption keys are established
      try {
        await WalletKit.safeSubscribe(session.topic)
      } catch { }
      store.dispatch(setSessions({ ...sessions }))
    } catch {
      const instance = await WalletKit.init()
      await instance.reject({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      })
    }
  }

  static async onSessionDelete(topic: string) {
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
  }

  static async disconnectSession(topic: string) {
    try {
      const instance = await WalletKit.init()
      await instance.disconnect({ topic, reason: getSdkError('USER_DISCONNECTED') })
    } catch { }
  }

  static async sessionDeleteAll() {
    try {
      const instance = await WalletKit.init()
      const sessions = instance.session.getAll()
      for (const session of sessions) {
        const t = session.topic
        try {
          await instance.disconnect({ topic: t, reason: getSdkError('USER_DISCONNECTED') })
        } catch { }
        await WalletKit.safeUnsubscribe(t)
      }
      store.dispatch(setSessions({}))
    } catch { }
  }

  static async onApproveRequest(id: number, topic: string, params: Params) {
    try {
      if (params?.chainId?.includes('eip155')) {
        const result = await WalletEvmUtil.approveRequest(id, topic, params)
        // result returned from approveRequest
        await WalletKit.respondSessionRequest(id, topic, result)
      }
    } catch (error) {
      await WalletKit.respondSessionRequest(id, topic, error, true)
    }
  }

  static async respondSessionRequest(id: number, topic: string, response: any, isError: boolean = false) {
    try {
      const instance = signClient || (await WalletKit.init())
      // Validate session/topic exists before responding to avoid core.crypto.encode() failures
      const activeSessions = instance.session.getAll().reduce((acc: Record<string, SessionTypes.Struct>, session: SessionTypes.Struct) => {
        acc[session.topic] = session
        return acc
      }, {})

      if (!activeSessions[topic]) {
        // If session missing, surface a structured error
        await instance.respond({
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
        await instance.respond({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: { code: -32000, message: (response as Error)?.message || 'Unknown error' },
          },
        })
      } else {
        await instance.respond({
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
        if (signClient) {
          await signClient.respond({
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
  }
}

export default WalletKit
