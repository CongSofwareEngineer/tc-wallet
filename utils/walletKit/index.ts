import 'react-native-get-random-values'
//
import '@walletconnect/react-native-compat'
import 'fast-text-encoding'

///
import { WalletKitTypes } from '@reown/walletkit'
import { WalletKit as TypeWallet } from '@reown/walletkit/dist/types/client'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

import { setSessions } from '@/redux/slices/sessionsSlice'
import { store } from '@/redux/store'
import { EIPNamespaces, Params, Session, Sessions } from '@/types/walletConnect'

import { cloneDeep } from '../functions'
import WalletEvmUtil from '../walletEvm'

import AppKit from './appkit'

export type TypeWalletKit = TypeWallet
let walletKit: TypeWalletKit
const subscribedTopics = new Set<string>()
class WalletKit {
  static async init(): Promise<TypeWalletKit> {
    if (walletKit) return walletKit
    const instance = await AppKit.init()
    walletKit = instance

    return walletKit
  }

  static async safeSubscribe(topic: string): Promise<void> {
    if (!topic) return
    if (!walletKit) return
    if (subscribedTopics.has(topic)) return
    try {
      await walletKit.core.relayer.subscribe(topic)

      subscribedTopics.add(topic)
    } catch (e) {
      // Error subscribing to topic
      void e
    }
  }

  static async safeUnsubscribe(topic: string): Promise<void> {
    if (!topic || !walletKit) return
    try {
      await walletKit.core.relayer.unsubscribe(topic)
    } catch (e) {
      // Error unsubscribing from topic
      void e
    }
    subscribedTopics.delete(topic)
  }

  static async reConnect(): Promise<void> {
    try {
      const instance = await this.init()

      const sessionsActive = await instance.getActiveSessions()
      const sessionValid: Sessions = {}

      if (sessionsActive) {
        for (const key of Object.keys(sessionsActive)) {
          const s = sessionsActive[key]
          await this.safeSubscribe(s.topic)
          sessionValid[key] = s
        }
      }
      const pairings = instance.core.pairing.getPairings()
      for (const pair of pairings) {
        await this.safeSubscribe(pair.topic)
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

  static async onSessionProposal(id: WalletKitTypes.SessionProposal['id'], params: Params, eipNamespaces: EIPNamespaces): Promise<void> {
    try {
      const instance = await this.init()
      const approvedNamespaces = this.buildApprovedNamespaces(params, eipNamespaces)

      const session = await instance.approveSession({
        id,
        namespaces: approvedNamespaces,
      })
      const sessions = cloneDeep<Sessions>(store.getState().sessions)
      sessions[session.topic] = session
      // Ensure we are subscribed to the new session's topic so that encryption keys are established
      try {
        await this.safeSubscribe(session.topic)
      } catch { }
      store.dispatch(setSessions({ ...sessions }))
    } catch {
      await walletKit.rejectSession({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      })
    }
  }

  static async onSessionDelete(topic: string): Promise<void> {
    try {
      const sessions = cloneDeep<Sessions>(store.getState().sessions)
      if (sessions[topic]) {
        delete sessions[topic]
      }
      store.dispatch(setSessions({ ...sessions }))

      await this.init()
      await this.safeUnsubscribe(topic)
    } catch (e) {
      void e
    }
  }

  static async disconnectSession(topic: string): Promise<void> {
    try {
      const walletKit = await this.init()
      await walletKit.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
    } catch { }
  }

  static async sessionDeleteAll(): Promise<void> {
    try {
      const instance = await this.init()
      const sessions = instance.getActiveSessions()
      for (const key in sessions) {
        const t = sessions[key].topic
        try {
          await instance.disconnectSession({ topic: t, reason: getSdkError('USER_DISCONNECTED') })
        } catch { }
        await this.safeUnsubscribe(t)
      }
      store.dispatch(setSessions({}))
    } catch { }
  }

  static async onApproveRequest(id: number, topic: string, params: Params): Promise<void> {
    try {
      if (params?.chainId?.includes('eip155')) {
        const result = await WalletEvmUtil.approveRequest(id, topic, params)
        // result returned from approveRequest
        await this.respondSessionRequest(id, topic, result)
      }
    } catch (error) {
      await this.respondSessionRequest(id, topic, error, true)
    }
  }

  static async respondSessionRequest(id: number, topic: string, response: any, isError: boolean = false): Promise<void> {
    try {
      const instance = walletKit || (await this.init())
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
        await this.safeSubscribe(topic)
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
  }
}

export default WalletKit
