import { Core } from '@walletconnect/core'
import { SignClient } from '@walletconnect/sign-client'
import { SessionTypes } from '@walletconnect/types'

type SignClientInstance = Awaited<ReturnType<typeof SignClient.init>>

class Appkits {
  private static signClient: SignClientInstance | null = null

  static async init(): Promise<any> {
    const core = new Core({
      projectId: process.env.PROJECT_ID || '40c7fbd30534a24b3a0c2c92a757a76b',
    })

    Appkits.signClient = await SignClient.init({
      core,
      metadata: {
        name: 'Demo React Native Wallet',
        description: 'Demo RN Wallet to interface with Dapps',
        url: 'www.walletconnect.com',
        icons: ['https://your_wallet_icon.png'],
      },
    })
    try {
      // @ts-ignore internal emitter; lift listener cap
      Appkits.signClient.core.relayer.events.setMaxListeners?.(50)
      Appkits.signClient.events.setMaxListeners?.(50)
    } catch { }

    return {
      ...Appkits.signClient,
      getActiveSessions: Appkits.getActiveSessions.bind(Appkits),
      pair: Appkits.pair.bind(Appkits),
      approveSession: Appkits.approveSession.bind(Appkits),
      rejectSession: Appkits.rejectSession.bind(Appkits),
      disconnectSession: Appkits.disconnectSession.bind(Appkits),
      respondSessionRequest: Appkits.respondSessionRequest.bind(Appkits),
      on: Appkits.on.bind(Appkits),
      off: Appkits.off.bind(Appkits),
      getPairings: Appkits.getPairings.bind(Appkits),
    }
  }

  static async getActiveSessions(): Promise<Record<string, SessionTypes.Struct>> {
    if (!Appkits.signClient) return {}
    return Appkits.signClient.session.getAll().reduce(
      (acc: Record<string, SessionTypes.Struct>, session: SessionTypes.Struct) => {
        acc[session.topic] = session
        return acc
      },
      {} as Record<string, SessionTypes.Struct>
    )
  }

  static async pair(uri: string) {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')
    return await Appkits.signClient.pair({ uri })
  }

  static async approveSession(params: { id: number; namespaces: any }) {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')

    const data = await Appkits.signClient.approve(params)
    const session = await data.acknowledged()
    return session
  }

  static async rejectSession(params: { id: number; reason: any }) {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')
    return await Appkits.signClient.reject(params)
  }

  static async disconnectSession(params: { topic: string; reason: any }) {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')
    return await Appkits.signClient.disconnect(params)
  }

  static async respondSessionRequest(params: {
    topic: string
    response: {
      id: number
      jsonrpc: string
      result?: any
      error?: any
    }
  }) {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')

    // For error responses
    if (params.response.error) {
      return await Appkits.signClient.respond({
        topic: params.topic,
        response: {
          id: params.response.id,
          jsonrpc: params.response.jsonrpc,
          error: params.response.error,
        },
      })
    }
    // For success responses
    return await Appkits.signClient.respond({
      topic: params.topic,
      response: {
        id: params.response.id,
        jsonrpc: params.response.jsonrpc,
        result: params.response.result,
      },
    })
  }

  static on(event: string, callback: (...args: any[]) => void) {
    if (Appkits.signClient) {
      Appkits.signClient.events.on(event as any, callback)
    }
  }

  static off(event: string, callback: (...args: any[]) => void) {
    if (Appkits.signClient) {
      Appkits.signClient.events.off(event as any, callback)
    }
  }

  static async getPairings() {
    if (!Appkits.signClient) throw new Error('SignClient not initialized')
    return Appkits.signClient.core.pairing.getPairings()
  }
}

export default Appkits
