import { SignClient } from '@walletconnect/sign-client'
import { ISignClient, SessionTypes } from '@walletconnect/types'

let signClient: ISignClient | null = null

class WalletConnectServices {
  static async init() {
    if (signClient) return signClient

    signClient = await SignClient.init({
      projectId: process.env.PROJECT_ID || '40c7fbd30534a24b3a0c2c92a757a76b', // fallback to your existing project ID
      metadata: {
        name: 'Demo React Native Wallet',
        description: 'Demo RN Wallet to interface with Dapps',
        url: 'www.walletconnect.com',
        icons: ['https://your_wallet_icon.png'],
      },
    })

    return signClient
  }

  static async getActiveSessions(): Promise<Record<string, SessionTypes.Struct>> {
    const client = await WalletConnectServices.init()
    return client.session.getAll().reduce(
      (acc: Record<string, SessionTypes.Struct>, session: SessionTypes.Struct) => {
        acc[session.topic] = session
        return acc
      },
      {} as Record<string, SessionTypes.Struct>
    )
  }

  static async pair(uri: string) {
    const client = await WalletConnectServices.init()
    return await client.pair({ uri })
  }

  static async approveSession(params: { id: number; namespaces: any }) {
    const client = await WalletConnectServices.init()
    return await client.approve(params)
  }

  static async rejectSession(params: { id: number; reason: any }) {
    const client = await WalletConnectServices.init()
    return await client.reject(params)
  }

  static async disconnectSession(params: { topic: string; reason: any }) {
    const client = await WalletConnectServices.init()
    return await client.disconnect(params)
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
    const client = await WalletConnectServices.init()
    // For error responses
    if (params.response.error) {
      return await client.respond({
        topic: params.topic,
        response: {
          id: params.response.id,
          jsonrpc: params.response.jsonrpc,
          error: params.response.error,
        },
      })
    }
    // For success responses
    return await client.respond({
      topic: params.topic,
      response: {
        id: params.response.id,
        jsonrpc: params.response.jsonrpc,
        result: params.response.result,
      },
    })
  }

  static on(event: string, callback: (...args: any[]) => void) {
    if (signClient) {
      signClient.events.on(event as any, callback)
    }
  }

  static off(event: string, callback: (...args: any[]) => void) {
    if (signClient) {
      signClient.events.off(event as any, callback)
    }
  }

  static async getPairings() {
    const client = await WalletConnectServices.init()
    return client.core.pairing.getPairings()
  }
}

export default WalletConnectServices
