import { CHAIN_DEFAULT } from '@/constants/chain'
import { ChainInfo } from '@/types/web3'
import {
  ChainFormatters,
  defineBlock,
  defineChain,
  defineTransaction,
  defineTransactionReceipt,
  formatTransaction,
  hexToBigInt,
  RpcTransaction,
  serializeTransaction,
} from 'viem'
import { OpStackBlock, OpStackRpcBlock, OpStackTransaction, OpStackTransactionReceipt } from 'viem/chains'
import BaseAPI from '../baseAPI'
export const formatters = {
  block: /*#__PURE__*/ defineBlock({
    format(args: OpStackRpcBlock): OpStackBlock {
      const transactions = args.transactions?.map((transaction) => {
        if (typeof transaction === 'string') return transaction
        const formatted = formatTransaction(transaction as RpcTransaction) as OpStackTransaction
        if (formatted.typeHex === '0x7e') {
          formatted.isSystemTx = transaction.isSystemTx
          formatted.mint = transaction.mint ? hexToBigInt(transaction.mint) : undefined
          formatted.sourceHash = transaction.sourceHash
          formatted.type = 'deposit'
        }
        return formatted
      })
      return {
        transactions,
        stateRoot: args.stateRoot,
      } as OpStackBlock
    },
  }),
  transaction: /*#__PURE__*/ defineTransaction({
    format(args: any): OpStackTransaction {
      const transaction = {} as OpStackTransaction
      if (args.type === '0x7e') {
        transaction.isSystemTx = args.isSystemTx
        transaction.mint = args.mint ? hexToBigInt(args.mint) : undefined
        transaction.sourceHash = args.sourceHash
        transaction.type = 'deposit'
      }
      return transaction
    },
  }),
  transactionReceipt: /*#__PURE__*/ defineTransactionReceipt({
    format(args: any): OpStackTransactionReceipt {
      return {
        l1GasPrice: args.l1GasPrice ? hexToBigInt(args.l1GasPrice) : null,
        l1GasUsed: args.l1GasUsed ? hexToBigInt(args.l1GasUsed) : null,
        l1Fee: args.l1Fee ? hexToBigInt(args.l1Fee) : null,
        l1FeeScalar: args.l1FeeScalar ? Number(args.l1FeeScalar) : null,
      } as OpStackTransactionReceipt
    },
  }),
} as const satisfies ChainFormatters

class ChainListServices extends BaseAPI {
  static baseUrl: string = 'https://chainlist.org/'

  static convertChainListToChainViem = (chain: ChainInfo) => {
    const chainConvert = defineChain({
      serializers: {
        transaction: serializeTransaction,
      },
      formatters: formatters,
      blockTime: 2_000,
      id: chain.chainId,
      testnet: chain.testnet,
      name: chain?.name || 'no name',
      nativeCurrency: chain.nativeCurrency,
      rpcUrls: {
        default: {
          http: chain.rpc.map((rpc) => rpc.url),
        },
      },
      blockExplorers: {
        default: {
          name: chain.explorers?.[0]?.name || 'no',
          url: chain.explorers?.[0]?.url || 'no',
        },
      },
    })

    return chainConvert
  }
  static async getAllChains() {
    try {
      const res = await this.get({ url: '/rpcs.json' })
      const arr = res.data as unknown as ChainInfo[]

      const arrChainValid = arr.filter((chain, index) => {
        if (!chain.name || !chain.nativeCurrency || chain?.rpc.length === 0) {
          return false
        }

        const rpcValid = chain?.rpc.filter((rpc) => {
          return rpc?.url?.startsWith('https://') && !rpc?.tracking
        })

        if (rpcValid.length === 0) {
          return false
        }
        arr[index].rpc = rpcValid

        return true
      })

      const arrFinal = arrChainValid.filter((chain) => {
        const isExitedChainDefault = CHAIN_DEFAULT.find((chainDefault) => chainDefault.id.toString() === chain.chainId.toString())
        return !isExitedChainDefault
      })

      return arrFinal.map((chain) => this.convertChainListToChainViem(chain))
    } catch (e) {
      return []
    }
  }
}

export default ChainListServices
