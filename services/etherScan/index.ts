import { Platform } from 'react-native'

import fetcherConfig from '@/configs/fetcher'
import { IFetch } from '@/configs/fetcher/type'
import { ETHER_SCAN_CONFIG } from '@/constants/etherScan'
import { ChainId } from '@/types/web3'
import EtherScanUtils from '@/utils/etherScan'

import { ContractEtherScan } from './type'

const fetcher = (params: IFetch) => {
  let url = `/api/ether-scan/${params?.url}`

  url = url.replace('//', '/')
  if (Platform.OS !== 'web') {
    url = url.replace('/api/ether-scan/', '/v2/api/')
    if (params.query) {
      params.query.apikey = EtherScanUtils.getEtherScanApiKey() || ''
    }
  }

  return fetcherConfig({
    baseUrl: Platform.OS === 'web' ? `${window.origin}` : ETHER_SCAN_CONFIG.URL + '/v2/api',
    headers: {
      accept: 'application/json',
    },
    ...params,
    url,
  })
}

class EtherScanService {
  static async getContractABI(chainId: ChainId, address: string) {
    let abi: any[] = []
    try {
      const query = {
        chainid: chainId,
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: 'apikey',
      }
      const res = await fetcher({
        query: query,
        url: '/',
      })

      if (Array.isArray(res?.data?.result) && res?.data?.result.length > 0) {
        const info: ContractEtherScan = res.data.result[0]
        abi = [...JSON.parse(info.ABI)]
        if (info?.Implementation) {
          const res = await this.getContractABI(chainId, info.Implementation)
          abi = [...abi, ...res]
        }
      }
      return abi
    } catch {
      return abi
    }
  }
}

export default EtherScanService
