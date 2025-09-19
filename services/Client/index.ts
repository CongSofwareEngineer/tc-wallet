import fetcher from '@/configs/fetcher'
import { ChainInfo } from '@/types/web3'

const ClientServices = {
  getAllChains: async (): Promise<ChainInfo[]> => {
    try {
      const res = await fetcher<ChainInfo[]>({
        url: 'https://chainlist.org/rpcs.json',
      })
      const arr = res as unknown as ChainInfo[]

      return arr.filter((chain) => !!chain.rpc && chain.rpc.length > 0)
    } catch (error) {
      return [] as ChainInfo[]
    }
  },
  getChainById: (id: number) => {
    /*...*/
  },
  // other client service methods
}

export default ClientServices
