import { useQuery } from '@tanstack/react-query'
import { erc20Abi } from 'viem'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { KEY_STORAGE } from '@/constants/storage'
import EVMServices from '@/services/EVM'
import { Token } from '@/services/moralis/type'
import { IQueryKey } from '@/types/reactQuery'
import { ChainId } from '@/types/web3'
import { convertWeiToBalance, sleep } from '@/utils/functions'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import useChainSelected from '../useChainSelected'
import useWallets from '../useWallets'

const getData = async ({ queryKey }: IQueryKey): Promise<Token[]> => {
  try {
    const [, address, chainId] = queryKey as [string, string, ChainId]
    const dataLocal = getDataLocal(KEY_STORAGE.ListTokenImport)
    if (dataLocal && dataLocal[`${chainId}_${address}`]) {
      const listToken = dataLocal[`${chainId}_${address}`] as Token[]
      const client = EVMServices.getClient(chainId)
      const arrFunc: any[] = []
      listToken.forEach((token) => {
        arrFunc.push({
          address: token.token_address! as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        })
      })

      const listBalance = await client.multicall({ contracts: arrFunc })

      const newListToken = listToken.map((token, index) => {
        if (listBalance[index] && listBalance[index].status === 'success' && listBalance[index].result) {
          const balance = listBalance[index].result as bigint

          return {
            ...token,
            is_imported: true,
            balance: balance.toString(),
            balance_formatted: convertWeiToBalance(balance, token.decimals),
          } as Token
        }

        return {
          ...token,
          is_imported: true,
          balance: '0',
          balance_formatted: '0',
        } as Token
      })

      saveDataLocal(KEY_STORAGE.ListTokenImport, {
        ...dataLocal,
        [`${chainId}_${address}`]: newListToken,
      })

      return newListToken
    }

    return []
  } catch (error) {
    return []
  }
}
const useBalanceTokenImport = () => {
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()

  const queries = useQuery({
    queryKey: [KEY_REACT_QUERY.getBalancesTokenImportByAddress, wallet?.address || '0x', chainId],
    queryFn: getData,
    enabled: !!wallet?.address && !!chainId,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const deleteToken = async (address: string) => {
    const data = queries?.data || []
    const newData = data.filter((item: any) => item.token_address.toLowerCase() !== address.toLowerCase())
    saveDataLocal(KEY_STORAGE.ListTokenImport, newData)

    await sleep(500)
    await queries.refetch()
  }

  const addToken = async (token: Token) => {
    const data = queries?.data || []
    const newData = [...data, token]
    saveDataLocal(KEY_STORAGE.ListTokenImport, newData)
    await sleep(500)
    await queries.refetch()
  }

  return { ...queries, deleteToken, addToken }
}

export default useBalanceTokenImport
