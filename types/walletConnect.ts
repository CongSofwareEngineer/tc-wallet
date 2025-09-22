import { SessionTypes } from '@walletconnect/types'

export type Session = SessionTypes.Struct
export type Sessions = Record<string, SessionTypes.Struct>

export type EIPNamespaces = Record<
  string,
  {
    chains: string[]
    methods: string[]
    events: string[]
    accounts: string[]
  }
>
export type Params = {
  request: {
    method: string
    params: any[]
    expiryTimestamp?: number
  }
  chainId: string
}

export type RequestAction = {
  id: number
  topic: string
  params: Params
}

export type RequestActions = RequestAction[]
