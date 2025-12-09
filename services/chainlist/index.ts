import { ChainInfo } from "@/types/web3";
import BaseAPI from "../baseAPI";

class ChainListServices extends BaseAPI {
  static baseUrl: string = 'https://chainlist.org/'

  static async getAllChains(): Promise<ChainInfo[]> {
    try {
      const res = await this.get('/rpcs.json')
      const arr = res.data as unknown as ChainInfo[]

      return arr.filter((chain) => !!chain.rpc && chain.rpc.length > 0 && !!chain.nativeCurrency)
    } catch {
      return [] as ChainInfo[]
    }
  }

}

export default ChainListServices
