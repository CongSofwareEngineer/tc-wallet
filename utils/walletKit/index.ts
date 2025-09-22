import 'react-native-get-random-values'

import { WalletKit as WalletKitCore, WalletKitTypes } from '@reown/walletkit'
import { WalletKit as TypeWallet } from '@reown/walletkit/dist/types/client'
import { Core } from '@walletconnect/core'
import { ProposalTypes } from '@walletconnect/types'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

import { EIPNamespaces, Params, Session, Sessions } from '@/types/walletConnect'
import { sessionsZustand } from '@/zustand/sessions'

import WalletEvmUtil from '../walletEvm'

export type TypeWalletKit = TypeWallet
let walletKit: TypeWalletKit

const WalletKit = {
  init: async () => {
    if (walletKit) return walletKit
    const core = new Core({
      projectId: '40c7fbd30534a24b3a0c2c92a757a76b',
    })

    walletKit = await WalletKitCore.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: 'Demo React Native Wallet',
        description: 'Demo RN Wallet to interface with Dapps',
        url: 'www.walletconnect.com',
        icons: ['https://your_wallet_icon.png'],
        redirect: {
          native: 'yourwalletscheme://',
        },
      },
    })

    return walletKit
  },
  reConnect: async () => {
    try {
      const walletKit = await WalletKit.init()
      const sessionsActive = walletKit.getActiveSessions()
      const sessionValid: Sessions = {}
      if (sessionsActive) {
        for (const key in sessionsActive) {
          try {
            await walletKit.core.relayer.subscribe(sessionsActive[key].topic)
            sessionValid[key] = sessionsActive[key]
          } catch (error) {
            console.error('reConnect error', error)
          }
        }
        console.log({ sessionValid })

        sessionsZustand.getState().setSessions(sessionValid)
      }
    } catch (error) { }
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
  buildApprovedNamespaces: (params: ProposalTypes.Struct, eipNamespaces: EIPNamespaces) => {
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: eipNamespaces,
    })
    return approvedNamespaces
  },
  onSessionProposal: async (
    id: WalletKitTypes.SessionProposal['id'],
    params: WalletKitTypes.SessionProposal['params'],
    eipNamespaces: EIPNamespaces
  ) => {
    try {
      const walletKit = await WalletKit.init()
      // ------- namespaces builder util ------------ //
      const approvedNamespaces = WalletKit.buildApprovedNamespaces(params, eipNamespaces)
      // ------- end namespaces builder util ------------ //

      const session = await walletKit.approveSession({
        id,
        namespaces: approvedNamespaces,
      })
      const newSessions = sessionsZustand.getState().sessions
      newSessions[session.topic] = session
      sessionsZustand.getState().setSessions(newSessions)
    } catch (error) {
      await walletKit.rejectSession({
        id: id,
        reason: getSdkError('USER_REJECTED'),
      })
    }
  },
  onSessionDelete: async (topic: string) => {
    try {
      const walletKit = await WalletKit.init()
      await walletKit.core.relayer.unsubscribe(topic)
      sessionsZustand.getState().removeSessionByTopic(topic)
    } catch (error) {
      console.error('onSessionDelete error', error)
    }
  },
  disconnectSession: async (topic: string) => {
    try {
      const walletKit = await WalletKit.init()
      await walletKit.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
    } catch (error) { }
  },

  sessionDeleteAll: async () => {
    try {
      const walletKit = await WalletKit.init()
      const sessions = walletKit.getActiveSessions()
      for (const key in sessions) {
        try {
          await walletKit.disconnectSession({
            topic: sessions[key].topic,
            reason: getSdkError('USER_DISCONNECTED'),
          })
          await walletKit.core.relayer.unsubscribe(sessions[key].topic)
        } catch (error) {
          console.error('sessionDeleteAll error', error)
        }
      }
      sessionsZustand.getState().setSessions({})
    } catch (error) {
      console.error('sessionDeleteAll error', error)
    }
  },
  onApproveRequest: async (id: number, topic: string, params: Params) => {
    try {
      if (params?.chainId?.includes('eip155')) {
        await WalletEvmUtil.approveRequest(id, topic, params)
      }
    } catch (error) { }
  },
}

export default WalletKit
